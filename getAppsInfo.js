var appIds = [];

kintone.api(kintone.api.url('/k/v1/apps', true), 'GET', {}, function(resp) {
  // success
  var apps = resp.apps
  for (var i = 0; i < apps.length; i++) {
    appIds[i] = apps[i].appId;
  }

  appIds.forEach( index => {

    kintone.api(kintone.api.url('/k/v1/app/settings', true), 'GET', {
      'app': index,
      'lang': 'ja'
    }, function(resp) {
      // success
      console.log(resp);
    }, function(error) {
      // error
      console.log(error);
    });
  });
  
}, function(error) {
  // error
  console.log(error);
});
