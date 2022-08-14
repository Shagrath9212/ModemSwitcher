'use strict';
(function () {

    let queriesDlg = "<button type='button' class='btn btn-primary p-1 m-3 add-position'>Добавить позицию</button>";
    queriesDlg += "<div id='special-url-grid' class='ag-theme-balham' style='height:400px;'></div>";

    var gridOptions = {
        defaultColDef: {
            onCellValueChanged: function (e) {
                console.log(e);
            }
        },

        columnDefs: [
            { headerName: "Url", field: "url", cellEditor: 'agLargeTextCellEditor', editable: true },
            {
                field: 'country',
                headerName: "Тип",
                cellEditor: 'agRichSelectCellEditor',
                cellEditorParams: {
                    cellHeight: 50,
                    values: ['Обязательно', 'Игнорировать'],
                },
            }
        ]
    };

    app.showSpecialUrlsDlg = function (session_id) {
        BootstrapDialog.show({
            title: "Редактирование специальных ссылок",
            message: queriesDlg,
            cssClass: "editor",
            size: BootstrapDialog.SIZE_WIDE,
            callback: function (result) {
                if (!result) {
                    return;
                }
            },
            onshown: function (dialogRef) {
                dialogRef.getModalDialog().find(".add-position").click(function () {
                    app.doRequest("http://192.168.56.1:8080/Data/AddSetting", { sessionId: session_id, settingType: "query" }, function (data) {
                        let row = {
                            query_id: data
                        }
                        gridOptions.api.applyTransaction({
                            add: [row]
                        });
                    });
                });

                let gridContainer = dialogRef.getModalDialog().find("#special-url-grid");
                new agGrid.Grid(gridContainer[0], gridOptions);
                
                app.doRequest("http://192.168.56.1:8080/Data/GetSpecialUrls", { sessionId: session_id }, function (data) {
                    gridOptions.api.setRowData(data);
                    gridOptions.api.sizeColumnsToFit();
                });
            },
            onhide: function () {
                callback(gridOptions.api.getDisplayedRowCount());
            }
        })
    };
}());