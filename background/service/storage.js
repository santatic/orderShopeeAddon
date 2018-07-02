app.service('storageFirestore', function ($q) {
    var _this = this;
    this.data = [];
    
    this.findAll = function (callback) {
        chrome.storage.local.get('data', function (keys) {
            console.log(keys);
            // if (keys.todo != null) {
            //     _this.data = keys.todo;
            //     for (var i=0; i<_this.data.length; i++) {
            //         _this.data[i]['id'] = i + 1;
            //     }
            //     //console.log(_this.data);
            //     callback(_this.data);
            // }
        });
    }

    this.sync = function () {
        chrome.storage.local.set({
            data: this.data
        }, function () {
            console.log('Data is stored in Chrome storage');
            chrome.storage.local.get('data', function (keys) {
                console.log(keys);
            });
        });       
    }

    this.removeAll = function () {
        this.data = [];
        this.sync();
    }

});