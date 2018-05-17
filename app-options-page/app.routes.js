app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
		templateUrl : "app-options-page/components/home/homeView.html",
		controller : "home-controller"
    })
    .when("/configuration", {
        templateUrl : "app-options-page/components/configuration/configurationView.html",
        controller : "configuration-controller"
    })
    .when("/orders", {
        templateUrl : "app-options-page/components/orders/ordersView.html",
        controller : "orders-controller"
    });
});