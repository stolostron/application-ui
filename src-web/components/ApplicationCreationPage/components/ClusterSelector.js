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
          mode: true,
          clusterLabelsList: [
            { id: 0, labelName: '', labelValue: '', validValue: false }
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
        mode: true,
        clusterLabelsList: [
          { id: 0, labelName: '', labelValue: '', validValue: false }
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
          <div>
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
        const { id, labelName, labelValue, validValue } = item
        if (validValue || id === 0) {
          return (
            <React.Fragment key={id}>
              <div className="matching-labels-container">
                <div className="matching-labels-input">
                  <TextInput
                    id={`labelName-${id}`}
                    name="labelName"
                    className="text-input"
                    labelText={id === 0 ? 'Label' : ''}
                    value={labelName === '' ? '' : labelName}
                    placeholder="Label name"
                    disabled={isReadOnly}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
                <div className="matching-labels-input">
                  <TextInput
                    id={`labelValue-${id}`}
                    name="labelValue"
                    className="text-input"
                    labelText={id === 0 ? 'Value' : ''}
                    value={labelValue === '' ? '' : labelValue}
                    placeholder="Label value"
                    disabled={isReadOnly}
                    onChange={this.handleChange.bind(this)}
                  />
                </div>

                {id !== 0 ? ( // Option to remove added labels
                  <div
                    id={id}
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
      const { active } = control
      if (targetName === 'clusterSelector-checkbox') {
        active.mode = event.target.checked ? true : false
      } else {
        const { clusterLabelsList } = active
        const labelID = parseInt(event.target.id.split('-')[1], 0)
        if (targetName === 'labelName') {
          clusterLabelsList[labelID].labelName = event.target.value
        } else if (targetName === 'labelValue') {
          clusterLabelsList[labelID].labelValue = event.target.value
        }
        clusterLabelsList[labelID].validValue = true
      }
    }

    handleChange(control)
  }
}

export default ClusterSelector

export const summarize = (control, controlData, summary) => {
  const { clusterLabelsList } = control.active || {}
  if (
    clusterLabelsList &&
    _.get(control, 'type', '') !== 'hidden' &&
    _.get(control, 'active.mode')
  ) {
    clusterLabelsList.forEach(({ labelName, labelValue }) => {
      if (labelName && labelValue) {
        summary.push(`${labelName}=${labelValue}`)
      }
    })
  }
}

export const reverse = (control, templateObject) => {
  if (!control.active) {
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
          clusterLabelsListID: clusterLabelsList.length
        }
      }
    }
  }
}
