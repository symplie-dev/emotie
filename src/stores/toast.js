'use strict';

var assign         = require('object-assign'),
    EventEmitter   = require('events').EventEmitter,
    Dispatcher     = require('../dispatcher'),
    ToastConstants = require('../constants/paginater'),
    _text          = 'Toast!',
    _isVisible     = false,
    ToastStore;

function _toast(text) {
  _isVisible = true;
  _text = text;
  
  setTimeout(function () {
    _isVisible = false;
    ToastStore.emitChange();
  }, 600);
}

ToastStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },

  getIsVisible: function () {
    return _isVisible;
  },
  
  getText: function () {
    return _text;
  }
});

ToastStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ToastConstants.ActionTypes.TOAST:
      _toast(action.text);
      ToastStore.emitChange();
      break;
    default:
      // no-op
      break;
  }
});

module.exports = ToastStore;