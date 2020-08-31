(function() {
  'use strict';
  kintone.events.on(['app.record.index.show', 'app.record.detail.show', 'app.record.edit.show'], function(event) {
        var record = event.record;
        // 増殖バグ回避
        if (document.getElementById('customer_list') !== null) {
            return event;
        }
        // To HTML escape
        function escapeHtml(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
        // スペースを取得
        var subtableSpace = kintone.app.record.getSpaceElement('customer_list');
        // Rest API
        
        function existsSameValue(array) {
          var s = new Set(array);
          return s.size != array.length;
        }
        
        function checkDuplication(considered_table, customer_name) {
          var properties = considered_table.value;
          var idsArray = [];
          for ( var i = 0; i < properties.length; i++) {
            idsArray[i] = properties[i].value.land_property_id.value;
          }
          if (existsSameValue(idsArray)) {
            window.alert(customer_name + " の項目が重複しています。");
          }
        }
        
        function retrieveStatus(considered_table) {
          
          var properties = considered_table.value;
          for ( var i = 0; i < properties.length; i++) {
            var land_id = properties[i].value.land_property_id.value;
            if (land_id == record.land_property_id.value ) {
              return properties[i].value.status_before_decision.value
            }
          }
        }
        
        var params = {
            'app': '9',
            'query': 'land_property_id in ("' + record.land_property_id.value + '") order by customer_id asc limit 500',
            'fields': ['$id', 'customer_name', 'considered_properties']
        };
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params).then(function(resp) {
          console.log(resp)
            // success:カスタマーの一覧を表示する
            var tableRecords = resp.records;
            var studentTable = '<table class="kintoneplugin-table">';
            studentTable += '<thead class="subtable-header-gaia">';
            studentTable += '<tr>';
            studentTable += '<th class="kintoneplugin-table-th subtable-label-gaia subtable-label-decimal-gaia" style="width: 150px;">';
            studentTable += '<span class="title subtable-label-inner-gaia">';
            studentTable += 'カスタマーID';
            studentTable += '</span>';
            studentTable += '</th>';
            studentTable += '<th class="kintoneplugin-table-th subtable-label-gaia subtable-label-decimal-gaia" style="width: 250px;">';
            studentTable += '<span class="title">';
            studentTable += '氏名';
            studentTable += '</span>';
            studentTable += '</th>';
            studentTable += '<th class="kintoneplugin-table-th subtable-label-gaia subtable-label-decimal-gaia" style="width: 250px;">';
            studentTable += '<span class="title">';
            studentTable += '状況';
            studentTable += '</span>';
            studentTable += '</th>';
            studentTable += '</tr>';
            studentTable += '</thead>';
            studentTable += '<tbody>';
            for (var i = 0; i < tableRecords.length; i++) {
                checkDuplication(tableRecords[i].considered_properties, escapeHtml(tableRecords[i].customer_name.value));
                studentTable += '<tr class="show-subtable-gaia">';
                studentTable += '<td>';
                studentTable += '<div class="kintoneplugin-table-td-control" style="text-align: right;">';
                studentTable += '<div class="control-value-gaia">'
                studentTable += '<a href="/k/9/show#record=' + escapeHtml(tableRecords[i].$id.value);
                studentTable += '" target="_blank">';
                studentTable += '<span class="control-value-content-gaia">'
                studentTable += escapeHtml(tableRecords[i].$id.value);
                studentTable += '</span>'
                studentTable += '</a>';
                studentTable += '</div>'
                studentTable += '</div>';
                studentTable += '</td>';
                studentTable += '<td>';
                studentTable += '<div class="kintoneplugin-table-td-control" style="text-align: left;">';
                studentTable += '<div class="control-value-gaia">'
                studentTable += '<span class="control-value-content-gaia">'
                studentTable += escapeHtml(tableRecords[i].customer_name.value);
                studentTable += '</span>'
                studentTable += '</div>'
                studentTable += '</div>';
                studentTable += '</td>';
                studentTable += '<td>';
                studentTable += '<div class="kintoneplugin-table-td-control" style="text-align: left;">';
                studentTable += '<div class="control-value-gaia">'
                studentTable += '<span class="control-value-content-gaia">'
                studentTable += retrieveStatus(tableRecords[i].considered_properties);
                studentTable += '</span>'
                studentTable += '</div>'
                studentTable += '</div>';
                studentTable += '</td>';
                studentTable += '</tr>';
            }
            studentTable += '</tbody>';
            studentTable += '</table>';
            subtableSpace.innerHTML = studentTable;
        }, function(error) {
            // error:エラーの場合はメッセージを表示する
            var errmsg = 'レコード取得時にエラーが発生しました。';
            // レスポンスにエラーメッセージが含まれる場合はメッセージを表示する
            if (typeof error.message !== 'undefined') {
                errmsg += '\n' + error.message;
            }
            subtableSpace.appendChild(document.createTextNode(errmsg));
        });
        return event;
  });
})();
