'use strict';

var Dispatcher         = require('../dispatcher'),
    PaginaterConstants = require('../constants/paginater'),
    PaginaterActions;

PaginaterActions = {
  goToPage: function (pageIndex) {
    Dispatcher.dispatch({
      type: PaginaterConstants.ActionTypes.GO_TO_PAGE,
      pageIndex: pageIndex
    });
  },
  
  resetEmoticons: function () {
    Dispatcher.dispatch({
      type: PaginaterConstants.ActionTypes.RESET_EMOTICONS
    });
  },
  
  updateEmoticons: function () {
    Dispatcher.dispatch({
      type: PaginaterConstants.ActionTypes.UPDATE_EMOTICONS
    });
  }
};

module.exports = PaginaterActions;