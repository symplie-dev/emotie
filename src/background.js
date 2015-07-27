var $   = require('jquery'),
    Q   = require('q'),
    Dao = require('./database'),
    emoticons;

function replaceEmoticonText(str) {
  var deferred      = Q.defer(),
      matchPromises = [],
      matches;
  
  matches = str.match(/\{([^{]+)\}/gmi) || [];
  
  matches.forEach(function (match) {
    
    var name = match.substring(1, match.length - 1),
        matchDeferred = Q.defer();
    
    Dao.getEmoticon(name).then(function (emoticon) {
      if (emoticon) {
        str = str.replace(match, emoticon.text);
      }
      matchDeferred.resolve();
    });
    
    matchPromises.push(matchDeferred.promise);
  });
  
  Q.all(matchPromises).done(function () {
    deferred.resolve(str);
  });
  
  return deferred.promise;
}

// Check if user has shortcuts turned on; if so listen for proper structure: {<emoticon_name>}
Dao.getSettings().then(function (settings) {
  var deferred = Q.defer();
  
  if (settings.shortcuts) {
    deferred.resolve(true)
  } else {
    deferred.resolve(false);
  }
  
  return deferred.promise;
}).then(function (listen) {
  var tid;
  
  if (listen) {
    $(document).on('input paste', function (evt) {
      
      if (tid) {
        clearTimeout(tid);
      }
      
      tid = setTimeout(function () {
        replaceEmoticonText($(evt.target).val()).then(function (str) {
          $(evt.target).val(str);
        });
      }, 500);
    });
  }
});