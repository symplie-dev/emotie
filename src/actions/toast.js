'use strict';

var Dispatcher     = require('../dispatcher'),
    ToastConstants = require('../constants/paginater'),
    ToastActions;

ToastActions = {
  toast: function (text) {
    Dispatcher.dispatch({
      type: ToastConstants.ActionTypes.TOAST,
      text: text
    });
  }
};

module.exports = ToastActions;