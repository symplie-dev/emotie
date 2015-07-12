'use strict';

var assign                   = require('object-assign'),
    EventEmitter             = require('events').EventEmitter,
    Dispatcher               = require('../dispatcher'),
    ModalConstants           = require('../constants/modal'),
    Dao                      = require('../database'),
    _settings                = { stats: {} },
    _isSettingsModalVisible  = false,
    _isSettingsModalAnimated = false,
    ModalStore;

function _showSettingsModal() {
  _isSettingsModalVisible = true;
  _isSettingsModalAnimated = true;
  
  setTimeout(function () {
    _isSettingsModalAnimated = false;
    ModalStore.emitChange();
  }, 400);
}

function _hideSettingsModal() {
  _isSettingsModalVisible = false;
  _isSettingsModalAnimated = true;
  
  setTimeout(function () {
    _isSettingsModalAnimated = false;
    ModalStore.emitChange();
  }, 400);
}

function _setSettings(settings) {
  _settings = settings;
  Dao.setSettings(settings);
}

ModalStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },

  getIsSettingsModalVisible: function () {
    return _isSettingsModalVisible;
  },
  
  getIsSettingsModalAnimated: function () {
    return _isSettingsModalAnimated;
  },
  
  getSettings: function () {
    return _settings;
  }
});

ModalStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ModalConstants.ActionTypes.SHOW_SETTINGS_MODAL:
      _showSettingsModal();
      ModalStore.emitChange();
      break;
    case ModalConstants.ActionTypes.HIDE_SETTINGS_MODAL:
      _hideSettingsModal();
      ModalStore.emitChange();
      break;
    case ModalConstants.ActionTypes.SET_SETTINGS:
      _setSettings(action.settings);
      ModalStore.emitChange();
    default:
      // no-op
      break;
  }
});

// Fetch settings
(function () {
  Dao.getSettings().then(function (settings) {
    _settings = settings;
    _settings.stats = {};
    
    Dao.getSyncBytesInUse().then(function (bytes) {
      _settings.stats.syncBytesInUse = bytes;
      _settings.stats.syncQuota = Dao.getSyncQuota();
      ModalStore.emitChange();
    });
  });
})()

module.exports = ModalStore;