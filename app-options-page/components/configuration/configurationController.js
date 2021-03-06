app.controller("configuration-controller", function ($scope, $q, chromeStorage, uiGridConstants) {

    var timeout = null;
    $('#testScan').on('keyup', function () {
        var that = this;
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            console.log($(that).val());
            $(that).val("")
        }, 500);
    });

    

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

    $scope.saveRow = function (rowEntity) {
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise(rowEntity, promise.promise);
        var jobskill_query = firestore.collection('suggest').doc(rowEntity.id)
        jobskill_query.update({
            "suggest_chat": rowEntity.suggest
        }).then(function () {
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
                }).then(function () {
                    check.push(i)
                });
            })
            var timer = setInterval(function () {
                if (check.length == selected.length) {
                    clearInterval(timer)
                    getSuggest()
                }
            }, 500)

        }

    },
    {
        title: "THÊM CÂU",
        action: function () {
            var n = new Noty({
                closeWith: [],
                text: '<textarea rows="3" id="suggest" autofocus style = "width:100%"></textarea>',
                buttons: [
                    Noty.button('YES', 'btn btn-success', function () {
                        var input = $('textarea#suggest').val()
                        if (input) {
                            docRef.doc().set({
                                "suggest_chat": input
                            }).then(function () {
                                getSuggest()
                                n.close();
                                new Noty({
                                    timeout: 2000,
                                    type: 'success',
                                    text: 'Đã Lưu Câu',
                                    theme: "relax"
                                }).show();
                            })
                        }
                    }, { id: 'button1', 'data-status': 'ok' }),

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
        chrome.storage.local.get('suggests', function (keys) {
            dataOnSnapshot = keys.suggests;
            console.log(dataOnSnapshot);
        })
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
    chrome.storage.local.get('data', function (keys) {
        console.log(keys);
    });

    chrome.storage.sync.get( /* String or Array */["configuration"], function (items) {
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
    $('input[type=file]').on("change", function () {

        var $files = $(this).get(0).files;

        if ($files.length) {

            // Reject big files
            if ($files[0].size > $(this).data("max-size") * 1024) {
                console.log("Please select a smaller file");
                return false;
            }

            // Begin file upload
            console.log("Uploading file to Imgur..");

            // Replace ctrlq with your own API key
            var apiUrl = 'https://api.imgur.com/3/image';
            var apiKey = '1a75998a3de24bd';

            var settings = {
                async: false,
                crossDomain: true,
                processData: false,
                contentType: false,
                type: 'POST',
                url: apiUrl,
                headers: {
                    Authorization: 'Client-ID ' + apiKey,
                    Accept: 'application/json'
                },
                mimeType: 'multipart/form-data'
            };

            var formData = new FormData();
            formData.append("image", $files[0]);
            settings.data = formData;

            // Response contains stringified JSON
            // Image URL available at response.data.link
            $.ajax(settings).done(function (response) {
                var obj = JSON.parse(response)
                console.log(obj.data.link);
            });

        }
    });

});