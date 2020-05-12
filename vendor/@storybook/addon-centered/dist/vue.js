'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return {
    template: '\n      <div :style="style">\n        <div :style="innerStyle">\n          <story/>\n        </div>\n      </div>\n    ',
    data: function data() {
      return {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto'
        },
        innerStyle: {
          margin: 'auto'
        }
      };
    }
  };
};