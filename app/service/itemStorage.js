angular.module('app').service('itemStorage', function ($q) {
    var _this = this;
    this.data = [];

    this.findAll = function(callback) {
        chrome.storage.sync.get('item', function(keys) {
            if (keys.item != null) {
                _this.data = keys.item;
                for (var i=0; i<_this.data.length; i++) {
                    _this.data[i]['id'] = i + 1;
                }
                console.log(_this.data);
                callback(_this.data);
            }
        });
    }

    this.sync = function() {
        chrome.storage.sync.set({item: this.data}, function() {
            console.log('Data is stored in Chrome storage');
        });
    }

    this.add = function (newContent) {
        
        var id = this.data.length + 1;
        var item = {
            id: id,
            key:key,
            completed: false,
            createdAt: new Date()
        };
        this.data.push(item);
        this.sync();
    }

    this.remove = function(item) {
        this.data.splice(this.data.indexOf(item), 1);
        this.sync();
    }

    this.removeAll = function() {
        this.data = [];
        this.sync();
    }

});