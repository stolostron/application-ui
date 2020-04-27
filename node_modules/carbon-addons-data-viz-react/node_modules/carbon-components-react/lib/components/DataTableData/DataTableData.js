"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var DataTableData = function DataTableData(props) {
  var children = props.children,
      className = props.className,
      isSelectable = props.isSelectable,
      isSelected = props.isSelected,
      value = props.value,
      id = props.id,
      isExpandable = props.isExpandable,
      isExpanded = props.isExpanded,
      other = _objectWithoutProperties(props, ["children", "className", "isSelectable", "isSelected", "value", "id", "isExpandable", "isExpanded"]);

  var selectableElement = _react.default.createElement("span", null, _react.default.createElement("input", {
    checked: isSelected,
    id: id,
    className: "bx--checkbox",
    type: "checkbox",
    value: value,
    name: id
  }), _react.default.createElement("label", {
    htmlFor: id,
    className: "bx--checkbox-label"
  }));

  var expandedElement = _react.default.createElement("button", {
    className: "bx--table-expand-v2__button"
  }, _react.default.createElement(_Icon.default, {
    name: "chevron--right",
    description: "Expandable icon",
    className: "bx--table-expand-v2__svg"
  }));

  var tableDataClassnames = (0, _classnames.default)(className, {
    'bx--table-expand-v2': isExpandable
  });
  return _react.default.createElement("td", _extends({
    className: tableDataClassnames
  }, other, {
    "data-previous-value": isExpanded ? 'collapsed' : ''
  }), isSelectable && selectableElement, isExpandable && expandedElement, children);
};

DataTableData.propTypes = {
  children: _propTypes.default.node,
  className: _propTypes.default.string
};
var _default = DataTableData;
exports.default = _default;