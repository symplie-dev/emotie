'use strict';

var Q = require('q'),
    EmotieDao;

window.indexedDB      = window.indexedDB      || window.webkitIndexedDB      || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange    = window.IDBKeyRange    || window.webkitIDBKeyRange    || window.msIDBKeyRange;

EmotieDao = {
  
  Constants: {
    DB_NAME:    'emotie',
    DB_VERSION: 1,
    READ_ONLY:  'readonly',
    READ_WRITE: 'readwrite'
  },
  
  defaultEmoticons: [
    { name: 'Le Face Face', text: '( ͡° ͜ʖ ͡°)' },
    { name: 'Oh Well', text: '¯\\_(ツ)_/¯' },
    { name: 'Sniper', text: '▄︻̷̿┻̿═━一' },
    { name: 'Group Lenny', text: '( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)' },
    { name: 'Glasses', text: '(▀̿Ĺ̯▀̿ ̿)' },
    { name: 'Over Here', text: '༼ つ ◕_◕ ༽つ' }
  ],
  
  /**
   * Create/open the IndexDB database.
   * 
   * @return {Promise<>}
   */
  init: function () {
    var deferred      = Q.defer(),
        request       = window.indexedDB.open(this.Constants.DB_NAME, this.Constants.DB_VERSION),
        upgradeNeeded = false,
        self          = this;
    
    request.onerror = function(evt) {
      console.log('Error opening IndexedDB');
      deferred.reject(evt);
    };
    
    request.onupgradeneeded = function(evt) {
      upgradeNeeded = true;
      
      self.handleUpgradeNeeded(evt).then(function () {
        deferred.resolve();
      });

      return evt;
    };
    
    request.onsuccess = function(evt) {
      // Only resolve if the onupgradeneeded event hasn't already fired
      if (!upgradeNeeded) {
        // self.handleUpgradeNeeded(evt).then(function () {
        //   deferred.resolve();
        // });
        deferred.resolve();
      }
    };
    
    // deferred.resolve();
    
    return deferred.promise;
  },
  
  /**
   * The version of the database that is found is not the latest. An
   * upgrade to the schema is likely needed.
   * 
   * @return {Promise<>}
   */
  handleUpgradeNeeded: function (evt) {
    var deferred = Q.defer(),
        self     = this;
    
    this.db = evt.target.result;
    
    if (!evt.oldVersion || evt.oldVersion < 1) {        // Create all stores
      console.log('init schema')
      this.initSchema().then(function () {
        console.log('created schema');
        return self.resetEmoticons();
      }).then(function () {
        console.log('reset emoticons complete');
        deferred.resolve();
      }).catch(function (err) {
        console.log('Error intializing IndexedDB');
        console.log(err);
        deferred.reject(err);
      });
    } else {
      console.log('nope: ' + evt.oldVersion);
    }
    
    return deferred.promise;
  },
  
  /**
   * Initialize all of the object stores.
   * 
   * @return {Promise<>}
   */
 initSchema: function () {
    var deferred = Q.defer();

    this.initEmoticonStore().then(function () {
      deferred.resolve();
    });

    return deferred.promise;
  },
  
  /**
   * Create the emoticon store.
   * 
   * @return {Promise<>}
   */
  initEmoticonStore: function () {
    var objectStore = this.db.createObjectStore('emoticons', { autoIncrement: true }),
        deferred = Q.defer();
    
    objectStore.createIndex('name', 'name', { unique: true });
    
    objectStore.transaction.oncomplete = function(event) {
      deferred.resolve();
    };
    
    return deferred.promise;
  },
  
  /**
   * Get a list of all emoticons
   * 
   * @return {Promise<Array>} List of emoticons
   */
  getEmoticons: function () {
    var deferred    = Q.defer(),
        objectStore = this.db.transaction('emoticons').objectStore('emoticons'),
        emoticons   = [];
    
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      
      if (cursor) {
        emoticons.push(cursor.value);
        cursor.continue();
      }
      
      else {
        deferred.resolve(emoticons);
      }
    };
    
    return deferred.promise;
  },
  
  /**
   * Add a new emoticon to the IndexedDB object store.
   * 
   * @param  {Emoticon} emoticon The emomticon to add
   * @return {Promise<Emoticon>}
   */
  insertEmoticon: function (emoticon) {
    var deferred = Q.defer(),
        tran     = this.db.transaction(['emoticons'], this.Constants.READ_WRITE),
        objStore, request;
    
    tran.oncomplete = function (evt) {
      deferred.resolve();
    };
    
    tran.onerror = function (evt) {
      deferred.reject(evt);
    };
    
    objStore = tran.objectStore('emoticons');
    
    request = objStore.add(emoticon);
    
    return deferred.promise;
  },
  
  /**
   * Reset all emoticons to the default list.
   * 
   * @return {Promise<>}
   */
  resetEmoticons: function () {
    var deferred = Q.defer(),
        promises = [],
        self     = this;
    
    console.log(self.defaultEmoticons)
    
    this.deleteEmoticons().then(function () {
      console.log('removed all emoticons')
      self.defaultEmoticons.forEach(function (emoticon) {
        console.log('push: ' + emoticon.text)
        promises.push(self.insertEmoticon(emoticon));
      });
      
      Q.all(promises).then(function () {
        console.log('all emticons added');
        deferred.resolve();
      });
    });
    
    return deferred.promise;
  },
  
  /**
   * Delete all emoticons in the IndexedDB object store.
   * 
   * @return {Promise<>}
   */
  deleteEmoticons: function () {
    var deferred    = Q.defer(),
        objectStore = this.db.transaction('emoticons').objectStore('emoticons');
    
    // objectStore.openCursor().onsuccess = function(event) {
    //   var cursor = event.target.result;
      
    //   if (cursor) {
    //     cursor.delete();
    //     cursor.continue();
    //   }
      
    //   else {
    //     deferred.resolve();
    //   }
    // };
    deferred.resolve();
    
    return deferred.promise;
  },
};

module.exports = EmotieDao;