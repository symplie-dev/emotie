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
  setResultsPerPage: function (resultsPerPage) {
    Dispatcher.dispatch({
      type: PaginaterConstants.ActionTypes.SET_RESULTS_PER_PAGE,
      resultsPerPage: resultsPerPage
    });
  }
};

module.exports = PaginaterActions;