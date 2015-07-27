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
    { name: 'Deal With It', text: '(▀̿Ĺ̯▀̿ ̿)' },
    { name: 'Over Here', text: '༼ つ ◕_◕ ༽つ' },
    { name: 'Disapproval', text: 'ಠ_ಠ' },
    { name: 'Table Flip', text: '(╯°□°）╯︵ ┻━┻' },
    { name: 'Respect Tables', text: '┬──┬ ノ( ゜-゜ノ)' },
    { name: 'Aaay', text: '(☞ﾟヮﾟ)☞' },
    { name: 'Cannot Unsee', text: '(ಥ_ಥ)' },
    { name: 'Really', text: '☉_☉' },
    { name: 'Strong Disapproval', text: 'ಠ╭╮ಠ' },
    { name: 'Monkey', text: '﴾͡๏̯͡๏﴿' },
    { name: 'Bear', text: 'ʕ•ᴥ•ʔ' },
    { name: 'Come At Me Bro', text: '(ง ͠° ͟ل͜ ͡°)ง' },
    { name: 'Song and Dance', text: '♪~ ᕕ(ᐛ)ᕗ'},
    { name: 'Why Not', text: '(\\/) (°,,,°) (\\/)'},
    { name: 'Dignified', text: '( ಠ ͜ʖರೃ)'},
    { name: 'Spider', text: 'ᄽὁȍ ̪ őὀᄿ'},
    { name: 'A Thought', text: '(°ロ°)☝'},
    { name: 'Wink', text: '◕‿↼'},
    { name: 'Crazy', text: '⊙_ʘ'},
    { name: 'Glasses', text: '⊜_⊜'}
  ],
  
  defaultSettings: {
    sort: 'SORT_NAME',
    resultsPerPage: 8,
    shortcuts: true
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
        emotePromise    = Q.defer(),
        settingsPromise = Q.defer();
    
    chrome.storage.sync.get('emoticons', function (data) {
      if (!data.emoticons) {
        self.resetEmoticons().then(function () {
          emotePromise.resolve();
        });
      } else {
        emotePromise.resolve();
      }
    });
    
    chrome.storage.local.get('settings', function (data) {
      if (!data.settings) {
        self.resetSettings().then(function () {
          settingsPromise.resolve();
        });
      } else {
        settingsPromise.resolve();
      }
    });
    
    Q.allSettled([emotePromise.promise, settingsPromise.promise]).then(function () {
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
    var deferred = Q.defer();
    
    chrome.storage.sync.get('emoticons', function (data) {
      var filtered = data.emoticons.filter(function (emoticon) {
            return emoticon.name.toLowerCase() === name.toLowerCase();
          });
      
      deferred.resolve(filtered[0]);
    });
    
    return deferred.promise;
  },
  
  isEmoticonUnique: function (name, emoticons) {
    var isUnique;
    
    emoticons = emoticons || [];
      
    isUnique = emoticons.filter(function (emoticon) {
      return emoticon.name.toLowerCase() === name.toLowerCase();
    }).length === 0;
    
    return isUnique;
  },
  
  /**
   * Add an emoticon to the Chrome sync storage. Note: emoticon
   * names must be unique. Adding duplicates will result in an
   * error.
   * 
   * @param  {Emoticon} newEmoticon     The emoticon object to add
   * @return {Promise<Array<Emoticon>>} The list of emoti` including the new one
   */
  addEmoticon: function (newEmoticon) {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.sync.get('emoticons', function (data) {
      var unique,
          emoticons = data.emoticons || [];
      
      unique = self.isEmoticonUnique(newEmoticon.name, emoticons);
      
      if (unique) {
        emoticons.push(newEmoticon);
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
   * Update an emoticon in the Chrome sync storage. You must
   * provide the original name of the emoticon to update, however
   * you may also provide a new name.
   * 
   * @param  {string}   name        The original name of the emoticon to update
   * @param  {Emoticon} updEmoticon The updated emoticon object
   * @return {Promise<Emoticon>}    The updated emoticon after successful update
   */
  updateEmoticon: function (name, updEmoticon) {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.sync.get('emoticons', function (data) {
      var unique,
          emoticons = data.emoticons || [];
      
      // If the name has been updated, make sure that it is uninque
      if (name.toLowerCase() !== updEmoticon.name.toLowerCase()) {
        unique = self.isEmoticonUnique(updEmoticon.name, emoticons);
      } else {  // If the name is unchanged it must already be unique
        unique = true;
      }
      
      if (unique) {
        emoticons = emoticons.map(function (emoticon) {
          if (emoticon.name.toLowerCase() === name.toLowerCase()) {
            emoticon.name = updEmoticon.name;
            emoticon.text = updEmoticon.text;
          }
          
          return emoticon;
        });
        
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
    
    chrome.storage.local.set({ 'settings': self.defaultSettings }, function () {
      deferred.resolve(self.defaultSettings);
    });
    
    return deferred.promise;
  },
  
  /**
   * Get all settings.
   * 
   * @return {Promise<Settings>} The settings object
   */
  getSettings: function () {
    var deferred = Q.defer();
    
    chrome.storage.local.get('settings', function (data) {
      deferred.resolve(data.settings);
    });
    
    return deferred.promise;
  },
  
  /**
   * Set the settings to the given settings object
   * 
   * @param  {Settings} settings The new settings object
   * @return {Promise<Settings>} The default settings 
   */
  setSettings: function (settings) {
    var deferred = Q.defer(),
        self     = this;
    
    chrome.storage.local.set({ 'settings': settings }, function () {
      deferred.resolve(settings);
    });
    
    return deferred.promise;
  },
  
  /**
   * Get the number bytes used by the emoticons.
   * 
   * @return {Promise<number>} The number of bytes in use
   */
  getSyncBytesInUse: function () {
    var deferred = Q.defer();
    
    chrome.storage.sync.getBytesInUse(null, function (bytesInUse) {
      deferred.resolve(bytesInUse);
    });
    
    return deferred.promise;
  },
  
  getSyncQuota: function () {
    return chrome.storage.sync.QUOTA_BYTES;
  }
};

module.exports = EmotieDao;