'use strict';

var _require = require('../../globals/js/settings'),
    prefix = _require.prefix;

var _require2 = require('../../globals/js/feature-flags'),
    breakingChangesX = _require2.breakingChangesX;

module.exports = {
  hidden: true,
  meta: {
    removed: breakingChangesX
  },
  context: {
    prefix: prefix
  },
  variants: [{
    name: 'default',
    label: 'Carousel',
    context: {
      items: [{
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=/0',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=/0'
      }, {
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=1',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=1'
      }, {
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=2',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=2'
      }, {
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=3',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=3'
      }, {
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=4',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=4'
      }, {
        filmstripImageUrl: 'http://via.placeholder.com/256x144?text=5',
        lightboxImageUrl: 'http://via.placeholder.com/1056x594?text=5'
      }]
    }
  }]
};