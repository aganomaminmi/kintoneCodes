(function() {
  'use strict';
  
  var updatedIds = [];
  var existingRows = [];
 
  kintone.events.on('app.record.edit.change.considered_properties', function(event) {
    existingRows = event.record.considered_properties.value.map( value => value.id );
    
  });
  
  kintone.events.on('app.record.edit.change.status_before_decision', function(event) {
    var changedId = event.changes.row.id;
    
    if ( updatedIds.indexOf(changedId) == -1 && changedId !== null) {
      updatedIds.unshift(changedId);
    }

  });
  
  kintone.events.on('app.record.edit.submit.success', function(event) {
    var tableValues = event.record.considered_properties.value.map( value => value.id );
    var addedRow = tableValues.filter( value => existingRows.indexOf(value) == -1 );
    var unupdatedIds = tableValues.filter( value => updatedIds.indexOf(value) == -1);
    var uneditedIds = unupdatedIds.filter( value => addedRow.indexOf(value) == -1);
    
    // console.log(tableValues + "が保存されている行です");
    // console.log(addedRow + "が追加された行です");
    // console.log(unupdatedIds + "がアップデートされていないか、追加された行です");
    // console.log(uneditedIds + "が追加もされず編集されていない行です");
    
    var tableUpdateParams = {
      "app": 8,
      "id": event.record.customer_id.value,
      "record": {
        "considered_properties": {
          "value": []
        }
      }
    };
    
    // リクエストパラメータの行を生成します
    updatedIds.forEach( value => {
      tableUpdateParams.record.considered_properties.value.push({ "id": value, "value": { "status_update_date": getFormatedDate() } });
    });
    uneditedIds.forEach( value => {
      tableUpdateParams.record.considered_properties.value.push({ "id": value });
    });
    addedRow.forEach( value => {
      tableUpdateParams.record.considered_properties.value.push({ "id": value, "value": { "status_update_date": getFormatedDate() } });
    });
    
    kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', tableUpdateParams).then(function(response) {
      console.log(response);
      updatedIds = [];
      existingRows = [];
      location.reload(true);
    }, function(error) {
      console.log(error);
    });

  });
  
  function getFormatedDate() {
    var format = "yyyy-MM-dd hh:mm";
    var now = new Date();
    
    format = format.replace(/yyyy/g, now.getFullYear());  
    format = format.replace(/MM/g, ('0' + (now.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + now.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + now.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + now.getMinutes()).slice(-2));
  
    return format;
  }
})();
