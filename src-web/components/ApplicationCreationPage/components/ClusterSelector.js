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
import { getSourcePath, removeVs } from '../../TemplateEditor/utils/utils'
import Tooltip from '../../TemplateEditor/components/Tooltip'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('./style.scss')
})

export class ClusterSelector extends React.Component {
  static propTypes = {
    control: PropTypes.object,
    controlId: PropTypes.string,
    handleChange: PropTypes.func,
    locale: PropTypes.string
  };

  constructor(props) {
    super(props)
    this.state = {}
    if (_.isEmpty(this.props.control.active)) {
      if (
        !this.props.control.showData ||
        this.props.control.showData.length === 0
      ) {
        this.props.control.active = {
          mode: false,
          clusterLabelsList: [
            { id: 0, labelName: '', labelValue: '', validValue: true }
          ],
          clusterLabelsListID: 1
        }
      } else {
        //display existing placement rule
        this.props.control.active = {
          mode: true,
          clusterLabelsList: this.props.control.showData,
          clusterLabelsListID: this.props.control.showData.length
        }
      }
    }
  }

  render() {
    if (!this.props.control.active) {
      this.props.control.active = {
        mode: '',
        clusterLabelsList: [
          { id: 0, labelName: '', labelValue: '', validValue: true }
        ],
        clusterLabelsListID: 1
      }
    }
    const { controlId, locale, control } = this.props
    const { name, active, validation = {} } = control
    const modeSelected = active && active.mode === true
    const isReadOnly = _.get(this.props, 'control.showData', []).length > 0

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

          <div className="clusterSelector-container">
            <Checkbox
              className="clusterSelector-checkbox"
              name="clusterSelector-checkbox"
              checked={modeSelected}
              disabled={isReadOnly}
              id={`clusterSelector-checkbox-${controlId}`}
              labelText={msgs.get(
                'tooltip.creation.app.settings.clusterSelector',
                locale
              )}
              onClick={this.handleChange.bind(this)}
            />

            <Accordion>
              <AccordionItem open={modeSelected} title={''}>
                <div className="clusterSelector-labels-section">
                  <div className="labels-descr">
                    {msgs.get(
                      'creation.app.settings.selectorClusters.config',
                      locale
                    )}
                  </div>

                  <div className="labels-section">
                    {this.renderClusterLabels(control, isReadOnly)}
                    <div
                      className={`add-label-btn ${
                        isReadOnly ? 'btn-disabled' : ''
                      }`}
                      tabIndex="0"
                      role={'button'}
                      onClick={() => this.addLabelToList(control, !isReadOnly)}
                      onKeyPress={this.addLabelKeyPress.bind(this)}
                    >
                      <Icon
                        name="icon--add--glyph"
                        fill="#3d70b2"
                        description=""
                        className="add-label-btn-icon"
                      />
                      <div className="add-label-btn-text">
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

  renderClusterLabels = (control, isReadOnly) => {
    if (!_.get(control, 'active.clusterLabelsList')) {
      return ''
    }
    return (
      control.active &&
      control.active.clusterLabelsList.map(item => {
        // Don't show deleted time invertals
        if (item.validValue) {
          return (
            <React.Fragment key={item.id}>
              <div className="matching-labels-container">
                <div className="matching-labels-input">
                  <TextInput
                    id={`labelName-${item.id}`}
                    name="labelName"
                    className="text-input"
                    labelText={item.id === 0 ? 'Label' : ''}
                    value={item.labelName === '' ? '' : item.labelName}
                    placeholder="Label name"
                    disabled={isReadOnly}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                <div className="matching-labels-input">
                  <TextInput
                    id={`labelValue-${item.id}`}
                    name="labelValue"
                    className="text-input"
                    labelText={item.id === 0 ? 'Value' : ''}
                    value={item.labelValue === '' ? '' : item.labelValue}
                    placeholder="Label value"
                    disabled={isReadOnly}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>

                {item.id !== 0 ? ( // Option to remove added labels
                  <div
                    id={item.id}
                    className="remove-label-btn"
                    tabIndex="0"
                    role={'button'}
                    onClick={() => this.removeLabelFromList(control, item)}
                    onKeyPress={this.removeLabelKeyPress.bind(this)}
                  >
                    <Icon
                      name="icon--close--glyph"
                      fill="#3d70b2"
                      className="remove-label-btn-icon"
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
    )
  };

  addLabelToList = (control, modeSelected) => {
    if (modeSelected) {
      // Create new "label" item
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
    // Removed labels are no longer valid
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
      case 'clusterSelector-checkbox':
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

export const reverse = (control, templateObject) => {
  let matchLabels = _.get(
    templateObject,
    getSourcePath('PlacementRule[0].spec.clusterSelector.matchLabels')
  )
  if (!matchLabels) {
    matchLabels = _.get(
      templateObject,
      getSourcePath('PlacementRule[0].spec.clusterLabels.matchLabels')
    )
  }
  if (matchLabels) {
    matchLabels = removeVs(matchLabels)
    if (matchLabels) {
      const clusterLabelsList = Object.entries(matchLabels).map(
        ([labelName, labelValue], id) => {
          return {
            id,
            labelName,
            labelValue,
            validValue: true
          }
        }
      )
      control.active = {
        mode: true,
        clusterLabelsList,
        clusterLabelsListID: 1
      }
    }
  }
}
