'use strict';

var assign                     = require('object-assign'),
    EventEmitter               = require('events').EventEmitter,
    Dispatcher                 = require('../dispatcher'),
    ModalConstants             = require('../constants/modal'),
    Dao                        = require('../database'),
    _settings                  = { stats: {}, resultsPerPage: 6 },
    SettingsStore;

function _setSettings(settings) {
  _settings = settings;
  Dao.setSettings(settings);
}

function _setStats(settings) {
  _settings.stats = {};
  
   Dao.getSyncBytesInUse().then(function (bytes) {
    _settings.stats.syncBytesInUse = bytes;
    _settings.stats.syncQuota = Dao.getSyncQuota();
    SettingsStore.emitChange();
  });
}

SettingsStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },
  
  getSettings: function () {
    return _settings;
  },
  
  initSettings: function () {
    Dao.getSettings().then(function (settings) {
      _settings = settings;
      
      if (!_settings) {
        Dao.resetSettings().then(function (settings) {
          _settings = settings;
          _setStats(_settings);
        });
      } else {
        _setStats(_settings);
      }
    });
  }
});

SettingsStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case ModalConstants.ActionTypes.SET_SETTINGS:
      _setSettings(action.settings);
      SettingsStore.emitChange();
      break;
    default:
      // no-op
      break;
  }
});

SettingsStore.initSettings();

module.exports = SettingsStore;