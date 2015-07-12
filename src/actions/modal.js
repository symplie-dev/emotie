'use strict';

var Dispatcher     = require('../dispatcher'),
    ModalConstants = require('../constants/modal'),
    ModalActions;

ModalActions = {
  showSettingsModal: function () {
    Dispatcher.dispatch({
      type: ModalConstants.ActionTypes.SHOW_SETTINGS_MODAL
    });
  },
  
  hideSettingsModal: function () {
    Dispatcher.dispatch({
      type: ModalConstants.ActionTypes.HIDE_SETTINGS_MODAL
    });
  },
  
  setSettings: function (settings) {
    Dispatcher.dispatch({
      type: ModalConstants.ActionTypes.SET_SETTINGS,
      settings: settings
    });
  }
};

module.exports = ModalActions;