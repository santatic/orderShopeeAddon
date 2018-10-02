app.controller("stockController", function($scope,uiGridConstants){
    $scope.options = {
        // enableHorizontalScrollbar = 0,
        enableRowSelection: true,
        enableSelectAll: true,
        enableGridMenu: true,
        paginationPageSizes: [15, 30, 45],
        paginationPageSize: 15,
        enableSorting: true,
        showGridFooter: false,
        enableCellEdit: false,
        columnDefs: [
            {
                name: "Id Phân Loại",
                field: "original_sku"
            },{
                name: "Tên Sản Phẩm",
                field: "productName"
            },{
                name: "Tên Phân Loại",
                field: "name"
            },{
                name: "Ngày thêm",
                field: "create_atStock",
                sort: {
                    direction: 'asc',
                    priority: 0
                },
            },{
                name: "Số Lượng",
                field: "quantity"
            },
        ],
        showGridFooter: true,
        enableFiltering: true,
        
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                console.log(rows);
            });
            gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
            // gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        }
    };
    $scope.options.enableHorizontalScrollbar = uiGridConstants.scrollbars.NEVER;
    var stockData = []
    chrome.storage.local.get('stocks', function (obj) {

        getStock(obj.stocks);
        stockData = obj.stocks
        console.log(stockData);

    })
    chrome.storage.onChanged.addListener(function (changes) {

        console.log("change", changes);
        getStock(changes.stocks.newValue);
        stockData = changes.stocks.newValue

    })

    function getStock(data){
        console.log(data);
        data.forEach(function(stock){
            stock.plots.forEach(function(plot){
                var obj = plot
                obj.idStock = stock.idStock
                obj.create_atStock = moment(stock.create_at.seconds * 1000).format("MM/DD/YYYY")
                obj.idInvoice = stock.invoiceId
                $scope.options.data.push(obj)
            })
        })
        $scope.gridApi.core.refresh()
    }
})