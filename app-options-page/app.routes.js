app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "app-options-page/components/home/homeView.html",
        controller : "home-controller",
        css: "app-options-page/components/home/style.css"
    })
    .when("/configuration", {
        templateUrl : "app-options-page/components/configuration/configurationView.html",
        controller : "configuration-controller"
    })
    .when("/orders", {
        templateUrl : "app-options-page/components/orders/ordersView.html",
        controller : "orders-controller as $ctrl"
    })
    .when("/payment", {
        templateUrl : "app-options-page/components/payment/paymentView.html",
        controller : "payment-controller"
    })
    .when("/orders/:id", {
        templateUrl : "app-options-page/components/print-ordershopee/printView.html",
        controller : "print-controller",
        css : "app-options-page/components/print-ordershopee/printView.css"
    }).when("/scan-order", {
        templateUrl : "app-options-page/components/scanOrder/scanView.html",
        controller : "scan-controller"
    }).when("/export/:id", {
        templateUrl : "app-options-page/components/export-detail/export.html",
        controller : "export-controller"
    }).when("/exportcode-list", {
        templateUrl : "app-options-page/components/exports/exportsView.html",
        controller : "exports-controller"
    }).when("/import/:id", {
        templateUrl : "app-options-page/components/import-detail/importView.html",
        controller : "import-controller"
    }).when("/importcode-list", {
        templateUrl : "app-options-page/components/imports/importsView.html",
        controller : "imports-controller"
    }).when("/products", {
        templateUrl : "app-options-page/components/products/productsView.html",
        controller : "products-controller",
        // css: "app-options-page/components/products/productsView.css",
    });;

});