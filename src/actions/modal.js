'use strict';

var Dispatcher     = require('../dispatcher'),
    ModalConstants = require('../constants/modal'),
    ModalActions;

ModalActions = {
  setSettings: function (settings) {
    Dispatcher.dispatch({
      type: ModalConstants.ActionTypes.SET_SETTINGS,
      settings: settings
    });
  }
};

module.exports = ModalActions;