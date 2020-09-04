(function() {
  'use strict';
  kintone.events.on(['app.record.index.show', 'app.record.detail.show', 'app.record.edit.show'], function(event) {
    console.log("はろ");
    var record = event.record;
    console.log(record);
    var subtableSpace = kintone.app.record; //.getSpaceElement('student_list');
    console.log(subtableSpace);

    
    record['contract_status']['disabled'] = true;
    console.log(record['contract_status']);
    
    return event;
    
  });
  
  kintone.events.on('app.record.edit.change.contract_status', function(event) {
    var record = event.record
    //record.contract_status.disabled = false;
  });
})();
