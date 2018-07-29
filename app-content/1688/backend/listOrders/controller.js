app.controller("ordersCtrl", ['$scope',
    function ($scope) {
        $('span.col.lang-checkbox.single-select-checkbox[data-checked="data-checked"]').each(function (val) {
            console.log($this.find(table))
        })

        var products = ({
            id: "ctime tự sinh",
            classify: [{
                original_sku: "ctime tự sinh 1",
                name: "tự đặt"
            }, {
                original_sku: "ctime tự sinh 2",
                name: "tự đặt"
            }],

            "linked_classify": [
                {
                    id: "lấy từ url",
                    original_sku: "ctime tự sinh 1",
                    sku_classify: "sku_Phân loại",
                },
                {
                    id: "lấy từ url",
                    original_sku: "ctime tự sinh 2",
                    sku_classify: "sku_Phân loại",
                },
            ]
        })
    }
])