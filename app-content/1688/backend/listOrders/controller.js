app.controller("ordersCtrl", ['$scope',
    function ($scope) {
        console.log("done");
        var e = document.getElementById("listBox");
        e.innerHTML='Found you';
        console.log("found", e.length)

        // $('span.col.lang-checkbox.single-select-checkbox[data-checked="data-checked"]').each(function (val) {
        //     console.log($(this).parents('li.item-active.order-item'))
        // })

    }
])