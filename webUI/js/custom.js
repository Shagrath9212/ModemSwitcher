'use strict';
(function () {
    let app = {};
    window.app = app;

    app.doRequest=function(url, data, callback){
        let _data = JSON.stringify(data);
        $.post(url, _data, function (dataStr) {
            if(!callback){
                return;
            }

            if (!dataStr) {
                callback();
                return;
            }

            let obj = JSON.parse(dataStr);
            callback(obj);
        })
    };

    $(document).ready(function () {
        var columnDefs = [
            { headerName: "Сайт", field: "TARGET_URL" },
            { headerName: "Запрос", field: "TARGET_URL1" },
            { headerName: "Время", field: "TARGET_URL2" },
            { headerName: "Платный", field: "TARGET_URL3" },
            { headerName: "Ошибка", field: "TARGET_URL4" },
        ];

        var gridOptions = {
            columnDefs: columnDefs
        };

        var gridDiv = document.querySelector('#myGrid');
        var _grid = new agGrid.Grid(gridDiv, gridOptions);
        // $.post("http://192.168.56.1:8080/Data/Test", function (dataStr) {
        //     if (!dataStr) {
        //         return;
        //     }
        //     let data = JSON.parse(dataStr);
        //     gridOptions.api.setRowData(data);
        // })
        gridOptions.api.setRowData([]);
        $("#settings-dlg-show-btn").click(app.showSettingsDlg);
    });
}());