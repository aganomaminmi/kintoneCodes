var appIds = [];

kintone.api(kintone.api.url('/k/v1/apps', true), 'GET', {}, function(resp) {
  // success
  var apps = resp.apps
  for (var i = 0; i < apps.length; i++) {
    appIds[i] = apps[i].appId;
  }

  kintone.api(kintone.api.url('/k/v1/apps', true), 'GET', {
      'ids': appIds.map( value => Number(value))
    }, response => console.log(response)
    , error => console.log(error)
  );

}, function(error) {
  // error
  console.log(error);
});
