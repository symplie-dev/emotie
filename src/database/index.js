'use strict';

var Q = require('q'),
    EmotieDao;

/**
 * Emoticons are stored in Chrome's sync storage (`chrome.storage.sync`). This
 * means that they are synced across multiple chrome clients as long as the user
 * is logged in.
 * 
 * Settings are stored in local storage. Because Chrome's sync storage is limited,
 * settings are stored in Chrome's local storage (`chrome.storage.local`). This saves
 * space for the user-added emoticons in the sync storage.
 */
EmotieDao = {
  
  Constants: {
    SORT_NAME:       'SORT_NAME',
    SORT_CREATED_AT: 'SORT_CREATED_AT',
    SORT_UPDATED_AT: 'SORT_UPDATED_AT',
    MIN_RPP:         3,
    MAX_RPP:         20,
    DUPLICATE:       'DUPLICATE'
  },
    
  defaultEmoticons: [
    { name: 'Le Face Face', text: '( ͡° ͜ʖ ͡°)' },
    { name: 'Oh Well', text: '¯\\_(ツ)_/¯' },
    { name: 'Sniper', text: '▄︻̷̿┻̿═━一' },
    { name: 'Group Lenny', text: '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)' },
    { name: 'Glasses', text: '(▀̿Ĺ̯▀̿ ̿)' },
    { name: 'Over Here', text: '༼ つ ◕_◕ ༽つ' }
  ],
  
  defaultSettings: {
    sort: 'SORT_NAME',
    resultsPerPage: 10
  },
  
  /**
   * Initialize the Chrome sync storage. When emotie is opened
   * for the first time, the storage is populated with the default
   * emoticons.
   * 
   * @return {Promise<>}
   */
  init: function () {
    var deferred        = Q.defer(),
        self            = this,
        emotePromise    = 0,
        settingsPromise = 0;
    
    chrome.storage.sync.get('emoticons', function (data) {
      if (!data.emoticons) {
        emotePromise = self.resetEmoticons();
      }
    });
    
    chrome.storage.local.get('settings', function (data) {
      if (!data.settings) {
        settingsPromise = self.resetSettings();
      }
    });
    
    Q.allSettled([emotePromise, settingsPromise]).then(function () {
      deferred.resolve();
    });
    
    return deferred.promise;
  },
  
  /**
   * Clear out the existing emoticons in storage and reload the
   * default emoticons.
   * 
   * @return {Promise<Array<Emoticons>>} The array of default emoticons
   */
  resetEmoticons: function () {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.sync.remove('emoticons', function () {
      chrome.storage.sync.set({ 'emoticons': self.defaultEmoticons }, function () {
        deferred.resolve(self.defaultEmoticons);
      });
    });
    
    return deferred.promise;
  },
  
  /**
   * Get all emoticons.
   * 
   * @return {Promise<Array<Emoticon>>} All emoticons stored in sync storage
   */
  getEmoticons: function () {
    var deferred = Q.defer();
    
    chrome.storage.sync.get('emoticons', function (data) {
      deferred.resolve(data.emoticons);
    });
    
    return deferred.promise;
  },
  
  /**
   * Get the emoticon with the given name.
   * 
   * @param  {string} name       The name of the emoticon to fetch
   * @return {Promise<Emoticon>} The emoticon matching the given name 
   */
  getEmoticon: function (name) {
    
  },
  
  /**
   * Add an emoticon to the Chrome sync storage. Note: emoticon
   * names must be unique. Adding duplicates will result in an
   * error.
   * 
   * @param  {Emoticon} newEmoticon     The emoticon object to add
   * @return {Promise<Array<Emoticon>>} The list of emoticons including the new one
   */
  addEmoticon: function (newEmoticon) {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.sync.get('emoticons', function (data) {
      var unique,
          emoticons = data.emoticons || [];
      
      unique = data.emoticons.filter(function (emoticon) {
        return emoticon.name === newEmoticon.name;
      }).length === 0;
      
      if (unique) {
        emoticons.add(newEmoticon);
        chrome.storage.sync.set({ 'emoticons': emoticons }, function () {
          deferred.resolve(emoticons);
        });
      } else {
        deferred.reject({
          reason: self.Constants.DUPLICATE
        });
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Delete the emoticon with the given name.
   * 
   * @param  {string} name              The name of the emoticon to delete
   * @return {Promise<Array<Emoticon>>} The list of emoticons with the
   *                                    desired emoticon removed
   */
  deleteEmoticon: function (name) {
    var deferred = Q.defer();
    
    chrome.storage.sync.get('emoticons', function (data) {
      var emoticons = data.emoticons || [];
      
      emoticons = emoticons.filter(function (emoticon) {
        return emoticon.name !== name;
      });  
      
      chrome.storage.sync.set({ 'emoticons': emoticons}, function () {
        deferred.resolve(emoticons);
      });
    });
    
    return deferred.promise;
  },
  
  /**
   * Reset all settings to the default.
   * 
   * @return {Promise<Settings>} The default settings 
   */
  resetSettings: function () {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.local.set( { 'settings': self.defaultSettings }, function () {
      deferred.resolve(self.defaultSettings);
    });
    
    return deferred.promise;
  }
};

module.exports = EmotieDao;