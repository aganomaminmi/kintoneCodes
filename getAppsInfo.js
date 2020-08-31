var appIds = [];
var appsSettings = [];

kintone.api(kintone.api.url('/k/v1/apps', true), 'GET', {}, function(resp) {
  // success
  var apps = resp.apps
  for (var i = 0; i < apps.length; i++) {
    appIds[i] = apps[i].appId;
  }

  appIds.forEach( ( value, index ) => {

    kintone.api(kintone.api.url('/k/v1/app/settings', true), 'GET', {
      'app': value,
      'lang': 'ja'
    }, function(response) {
      // success
      console.log(response);
      appsSettings[index] = response;
    }, function(error) {
      // error
      console.log(error);
    });
  });
  console.log(appsSettings);

}, function(error) {
  // error
  console.log(error);
});
