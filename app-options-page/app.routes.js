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
    });;

});