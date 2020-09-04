(function() {
  'use strict';
  kintone.events.on(['mobile.app.record.index.show', 'mobile.app.record.edit.show', 'mobile.app.record.detail.show'], function(event) {
        // window.alert("スマンホホ")
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
        var subtableSpace = kintone.mobile.app.record.getSpaceElement('customer_list');
        // Rest API
        var params = {
            'app': '9',
            'query': 'land_property_id in ("' + record.land_property_id.value + '") order by customer_id asc limit 500',
            'fields': ['$id', 'customer_name']
        };
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', params).then(function(resp) {
            // success:生徒一覧を表示する
            var tableRecords = resp.records;
            var studentTable = '<table class="kintoneplugin-table">';
            studentTable += '<thead class="subtable-header-gaia">';
            studentTable += '<tr>';
            studentTable += '<th class="kintoneplugin-table-th subtable-label-gaia subtable-label-decimal-gaia" style="width: 150px;">';
            studentTable += '<span class="title subtable-label-inner-gaia">';
            studentTable += '顧客ID';
            studentTable += '</span>';
            studentTable += '</th>';
            studentTable += '<th class="kintoneplugin-table-th subtable-label-gaia subtable-label-decimal-gaia" style="width: 250px;">';
            studentTable += '<span class="title">';
            studentTable += '氏名';
            studentTable += '</span>';
            studentTable += '</th>';
            studentTable += '</tr>';
            studentTable += '</thead>';
            studentTable += '<tbody>';
            for (var i = 0; i < tableRecords.length; i++) {
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
                studentTable += '</tr>';
            }
            studentTable += '</tbody>';
            studentTable += '</table>';
            studentTable += '<p>こちらのUIは後からスマホ版のものに寄せます</p>'
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
