'use strict';

var assign             = require('object-assign'),
    EventEmitter       = require('events').EventEmitter,
    Dispatcher         = require('../dispatcher'),
    PaginaterConstants = require('../constants/paginater'),
    _resultsPerPage    = 10,
    _pageIndex         = 0,
    PaginaterStore;

PaginaterStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit('change');
  },

  addChangeListener: function (callback) {
    this.on('change', callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener('change', callback);
  },

  getPageIndex: function () {
    return _pageIndex;
  },
  
  getResultsPerPage: function () {
    return _resultsPerPage;
  }
});

PaginaterStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case PaginaterConstants.ActionTypes.GO_TO_PAGE:
      _pageIndex = action.pageIndex;
      PaginaterStore.emitChange();
      break;
    case PaginaterConstants.ActionTypes.SET_RESULTS_PER_PAGE:
      _resultsPerPage = action.resultsPerPage;
      PaginaterStore.emitChange();
      break;
    default:
      // no-op
      break;
  }
});

module.exports = PaginaterStore;