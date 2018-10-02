app.service('storageFirestore', function ($q) {
    var _this = this;
    this.data = [];
    this.suggests = []
    this.exports = []
    this.products = [];
    this.invoices = []
    this.stocks = []
    
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
    this.syncStock = function(){
        chrome.storage.local.set({
            stocks: this.stocks
        }, function () {
            console.log('Stock is stored in Chrome storage');
            chrome.storage.local.get('stocks', function (keys) {
                console.log(keys);
            });
        }); 
    }
    this.syncSuggests = function(){
        chrome.storage.local.set({
            suggests: this.suggests
        }, function () {
            console.log('Suggests is stored in Chrome storage');
            chrome.storage.local.get('suggests', function (keys) {
                console.log(keys);
            });
        }); 
    }
    this.syncInvoices = function(){
        chrome.storage.local.set({
            invoices: this.invoices
        }, function () {
            console.log('Invoices is stored in Chrome storage');
            chrome.storage.local.get('invoices', function (keys) {
                console.log(keys);
            });
        }); 
    }
    this.syncExports = function(){
        chrome.storage.local.set({
            export: this.exports
        }, function () {
            console.log('Exports is stored in Chrome storage');
            chrome.storage.local.get('export', function (keys) {
                console.log(keys);
            });
        }); 
    }
    this.syncProducts = function(){
        chrome.storage.local.set({
            products: this.products
        }, function () {
            console.log('Products is stored in Chrome storage');
            chrome.storage.local.get('products', function (keys) {
                console.log(keys);
            });
        }); 
    }

    this.check = false

    this.syncOrders = function () { 
        chrome.storage.local.set({
            data: this.data
        }, function () {
            console.log('Data is stored in Chrome storage');
            chrome.storage.local.get('data', function (keys) {
                console.log(keys);
                if (!this.check) {
                    chrome.notifications.clear('reminder', function(wasCleared){
                        console.log("closed",wasCleared);
                        this.check = true
                    })
                    
                  }
            });
        });  

    }


});