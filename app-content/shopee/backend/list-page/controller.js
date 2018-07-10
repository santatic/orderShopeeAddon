app.controller("list-shopee-saleCtrl", ['$scope', 'moment', 'getList', 'Chat',
    function ($scope, moment, getList,Chat) {
        console.log("list");
        getList.getList()
        Chat.getSuggests()
        // chrome.runtime.sendMessage({
        //     mission: "updateList"
        // }, function (response) {
        //     console.log("recived");
        // })
        

    }
])