'use strict';

var assign             = require('object-assign'),
    EventEmitter       = require('events').EventEmitter,
    Q                  = require('q'),
    Dispatcher         = require('../dispatcher'),
    PaginaterConstants = require('../constants/paginater'),
    Dao                = require('../database'),
    _pageIndex         = 0,
    _emoticons         = [],
    PaginaterStore;

function _resetEmoticons() {
  var deferred = Q.defer();
  
  Dao.resetEmoticons().then(function (emoticons) {
    _emoticons = emoticons;
    deferred.resolve();
  });
  
  return deferred.promise;
}

function _updateEmoticons() {
  var deferred = Q.defer();
  
  Dao.getEmoticons().then(function (emoticons) {
    _emoticons = emoticons;
    deferred.resolve();
  })
  
  return deferred.promise;
}

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
  
  getEmoticons: function () {
    return _emoticons;
  }
});

PaginaterStore.dispatchToken = Dispatcher.register(function(action) {
  switch(action.type) {
    case PaginaterConstants.ActionTypes.GO_TO_PAGE:
      _pageIndex = action.pageIndex;
      PaginaterStore.emitChange();
      break;
    case PaginaterConstants.ActionTypes.RESET_EMOTICONS:
      _resetEmoticons().then(function () {
        PaginaterStore.emitChange();
      });
      break;
    case PaginaterConstants.ActionTypes.UPDATE_EMOTICONS:
      _updateEmoticons().then(function () {
        PaginaterStore.emitChange();
      });
      break;
    default:
      // no-op
      break;
  }
});

// Initialize the store from the emoticons in the Chrome sync storage
Dao.init().then(function () {
  return Dao.getEmoticons();
}).then(function (emoticons) {
  _emoticons = emoticons;
  PaginaterStore.emitChange();
});

module.exports = PaginaterStore;