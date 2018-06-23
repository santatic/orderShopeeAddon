app.controller("configuration-controller", function ($scope, $q, chromeStorage, uiGridConstants) {

    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        columnDefs: [{
            name: "Câu thoại",
            field: "suggest"
        }],
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {

            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                // var msg = 'rows changed ' + rows;
                console.log(rows);
            });

            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    }

    $scope.saveRow = function( rowEntity ) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
        var jobskill_query = firestore.collection('suggest').doc(rowEntity.id)
                jobskill_query.update({
                    "suggest_chat": rowEntity.suggest
                }).then(function(){
                    new Noty({
                        layout: 'bottomRight',
                        theme: 'relax',
                        timeout: 3000,
                        type: 'success',
                        text: 'ĐÃ CẬP NHẬT SUGGEST'
                    }).show();
                });
      };
      
    $scope.options.multiSelect = true;
    var check = []
    $scope.options.gridMenuCustomItems = [{
        title: "XÓA CÂU",
        action: function () {
            var selected = $scope.gridApi.selection.getSelectedRows();
            $.each(selected, function (i, value) {
                console.log(value.suggest);
                var jobskill_query = firestore.collection('suggest').where('suggest_chat', '==', value.suggest);
                jobskill_query.get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        doc.ref.delete();
                    });
                }).then(function(){
                    check.push(i)
                });
            })
            var timer =setInterval(function(){
                if(check.length == selected.length){
                    clearInterval(timer)
                    getSuggest()
                }
            },500)

        }

    },
{
    title: "THÊM CÂU",
        action: function () {
            var n = new Noty({
                closeWith: [],
                text: 'Do you want to continue? <input id="suggest" type="text">',
                buttons: [
                  Noty.button('YES', 'btn btn-success', function () {
                    var input = $('input#suggest').val()
                    if (input) {
                        docRef.doc().set({
                            "suggest_chat": input
                        }).then(function () {
                            getSuggest()
                            n.close();
                        })
                    }
                  }, {id: 'button1', 'data-status': 'ok'}),
              
                  Noty.button('NO', 'btn btn-error', function () {
                    $('input#suggest').val("")
                      n.close();
                  })
                ]
              }).show();
        }
}]

    docRef = firestore.collection("suggest");

    function getSuggest() {
        var sources_suggest = []
        docRef.get().then(
            function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    const data = doc.data()
                    var obj = new Object()
                    obj = {
                        suggest: data.suggest_chat,
                        id: doc.id
                    }
                    sources_suggest.push(obj)
                })
                $scope.data = sources_suggest
                $scope.options.data = $scope.data;
                $scope.loading = false
                $scope.gridApi.core.refresh();
            })
    }
    getSuggest()

    $scope.addSuggest = function () {
        var input = $('input#suggest').val()
        if (input) {
            docRef.doc().set({
                "suggest_chat": input
            }).then(function () {
                getSuggest()
            })
        }

    }
    $scope.cancelSuggest = function () {
        $('input#suggest').val("")
    }

    chrome.storage.sync.get( /* String or Array */ ["configuration"], function (items) {
        console.log(items);
        $scope.configuration = items.configuration;
        //  items = [ { "yourBody": "myBody" } ]
    });

    $scope.submitRateCNY = function () {
        //console.log($scope.configuration);
        chrome.storage.sync.set({
            "configuration": $scope.configuration
        }, function () {
            //  A data saved callback omg so fancy
            new Noty({
                timeout: 3000,
                type: 'success',
                text: 'Đã Lưu'
            }).show();
        });
    };


    $scope.chromeStorage = chromeStorage;
    $scope.$watch('chromeStorage.data', function () {
        $scope.todoList = $scope.chromeStorage.data;
    });

    $scope.chromeStorage.findAll(function (data) {
        $scope.todoList = data;
        $scope.$apply();
    });

    $scope.add = function () {
        chromeStorage.add($scope.newContent);
        $scope.newContent = '';
    }

    $scope.remove = function (todo) {
        chromeStorage.remove(todo);
    }

    $scope.removeAll = function () {
        chromeStorage.removeAll();
    }

    $scope.toggleCompleted = function () {
        chromeStorage.sync();
    }
});