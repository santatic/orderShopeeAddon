app.controller("configuration-controller", function ($scope, chromeStorage) {
    chrome.storage.sync.get(/* String or Array */["configuration"], function(items){
        console.log(items);
        $scope.configuration = items.configuration;
        //  items = [ { "yourBody": "myBody" } ]
    });

    $scope.submitRateCNY = function () {
        //console.log($scope.configuration);
        chrome.storage.sync.set({ "configuration": $scope.configuration}, function(){
            //  A data saved callback omg so fancy
            new Noty({timeout: 3000, type: 'success', text: 'Đã Lưu'}).show();
        });
    };


    $scope.chromeStorage = chromeStorage;
    $scope.$watch('chromeStorage.data', function() {
        $scope.todoList = $scope.chromeStorage.data;
    });

    $scope.chromeStorage.findAll(function(data){
        $scope.todoList = data;
        $scope.$apply();
    });

    $scope.add = function() {
        chromeStorage.add($scope.newContent);
        $scope.newContent = '';
    }

    $scope.remove = function(todo) {
        chromeStorage.remove(todo);
    }

    $scope.removeAll = function() {
        chromeStorage.removeAll();
    }

    $scope.toggleCompleted = function() {
        chromeStorage.sync();
    }
});