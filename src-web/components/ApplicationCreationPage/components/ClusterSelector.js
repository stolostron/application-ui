/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import resources from '../../../../lib/shared/resources'
import {
  Accordion,
  AccordionItem,
  Checkbox,
  Icon,
  TextInput
} from 'carbon-components-react'
import Tooltip from '../../TemplateEditor/components/Tooltip'
import msgs from '../../../../nls/platform.properties'

resources(() => {
  require('./style.scss')
})

export class ClusterSelector extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {}
    this.props.control.active = {
      mode: '',
      clusterLabelsList: [
        { id: 0, labelName: '', labelValue: '', validValue: true }
      ],
      clusterLabelsListID: 1
    }
  }

  render() {
    const { locale, control } = this.props
    const { name, validation = {} } = control
    const modeSelected = control.active.mode ? true : false
    return (
      <React.Fragment>
        <div className="creation-view-controls-labels">
          <div className="creation-view-controls-textarea-title">
            {name}
            {validation.required ? (
              <div className="creation-view-controls-required">*</div>
            ) : null}
            <Tooltip control={control} locale={locale} />
          </div>

          <div className="timeWindow-container">
            <Checkbox
              className="clusterSelector-mode-container"
              name="clusterSelector-mode-container"
              id="clusterSelector-mode-container"
              labelText={msgs.get(
                'tooltip.creation.app.settings.clusterSelector',
                locale
              )}
              onClick={this.handleChange.bind(this)}
            />

            <Accordion>
              <AccordionItem open={modeSelected} title={''}>
                <div className="timeWindow-config-container">
                  <div className="config-days-section">
                    <div className="config-descr">
                      {msgs.get(
                        'creation.app.settings.selectorClusters.config',
                        locale
                      )}
                    </div>
                  </div>

                  <div className="config-time-section">
                    {this.renderClusterLabels(control, modeSelected)}
                    <div
                      className={`add-time-btn ${
                        !modeSelected ? 'btn-disabled' : ''
                      }`}
                      tabIndex="0"
                      role={'button'}
                      onClick={() => this.addLabelToList(control, modeSelected)}
                      onKeyPress={this.addLabelKeyPress.bind(this)}
                    >
                      <Icon
                        name="icon--add--glyph"
                        fill="#3d70b2"
                        description=""
                        className="add-time-btn-icon"
                      />
                      <div className="add-time-btn-text">
                        {msgs.get(
                          'creation.app.settings.selectorClusters.prop.add',
                          locale
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderClusterLabels = (control, modeSelected) => {
    return control.active.clusterLabelsList.map(item => {
      // Don't show deleted time invertals
      if (item.validValue) {
        return (
          <React.Fragment key={item.id}>
            <div className="config-time-container">
              <TextInput
                id={`labelName-${item.id}`}
                name="labelName"
                labelText={item.id === 0 ? 'Label' : ''}
                placeholder="Label name"
                disabled={!modeSelected}
                onChange={this.handleChange.bind(this)}
              />
              <div>&nbsp;</div>
              <TextInput
                id={`labelValue-${item.id}`}
                name="labelValue"
                placeholder="Label value"
                labelText={item.id === 0 ? 'Value' : ''}
                disabled={!modeSelected}
                onChange={this.handleChange.bind(this)}
              />

              {item.id !== 0 ? ( // Option to remove added times
                <div
                  id={item.id}
                  className="remove-time-btn"
                  tabIndex="0"
                  role={'button'}
                  onClick={() => this.removeLabelFromList(control, item)}
                  onKeyPress={this.removeLabelKeyPress.bind(this)}
                >
                  <Icon
                    name="icon--close--glyph"
                    fill="#3d70b2"
                    className="remove-time-btn-icon"
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          </React.Fragment>
        )
      }
      return ''
    })
  };

  addLabelToList = (control, modeSelected) => {
    if (modeSelected) {
      // Create new "time" item
      control.active.clusterLabelsList.push({
        id: control.active.clusterLabelsListID,
        labelName: '',
        labelValue: '',
        validValue: true
      })
      control.active.clusterLabelsListID++

      // Update UI
      this.forceUpdate()
    }
  };

  addLabelKeyPress = e => {
    if (e.type === 'click' || e.key === 'Enter') {
      this.addLabelToList(this.props.control)
    }
  };

  removeLabelFromList = (control, item) => {
    // Removed times are no longer valid
    control.active.clusterLabelsList[item.id].validValue = false

    // Update UI and yaml editor
    this.forceUpdate()
    this.handleChange({})
  };

  removeLabelKeyPress = e => {
    if (e.type === 'click' || e.key === 'Enter') {
      this.removeLabelFromList(this.props.control, { id: e.target.id })
    }
  };

  handleChange(event) {
    const { control, handleChange } = this.props
    let targetName = ''
    try {
      targetName = event.target.name
    } catch (e) {
      targetName = ''
    }

    if (targetName) {
      switch (targetName) {
      case 'clusterSelector-mode-container':
        control.active.mode = event.target.checked
        break
      case 'labelName':
        {
          const labelNameID = parseInt(event.target.id.split('-')[1], 0)
          control.active.clusterLabelsList[labelNameID].labelName =
              event.target.value
        }
        break
      case 'labelValue':
        {
          const labelValueID = parseInt(event.target.id.split('-')[1], 0)
          control.active.clusterLabelsList[labelValueID].labelValue =
              event.target.value
        }
        break
      }
    }

    handleChange(control)
  }
}

export default ClusterSelector
