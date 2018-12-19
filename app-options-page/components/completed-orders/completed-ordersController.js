app.controller("completed-orders-controller", function ($scope, $http, uiGridConstants) {
    console.log($scope.filterOrderStatus)
    $scope.filterOrderStatus = "0"
    console.log($scope.filterOrderStatus)

    var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
    };
    $scope.gridOptions = {
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        columnDefs: [
            { name: 'name' },
            { name: 'gender', enableSorting: false },
            { name: 'company', enableSorting: false }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                if (sortColumns.length == 0) {
                    paginationOptions.sort = null;
                } else {
                    paginationOptions.sort = sortColumns[0].sort.direction;
                }
                getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                getPage();
            });
        }
    };

    var getPage = function () {
        var url;
        switch (paginationOptions.sort) {
            case uiGridConstants.ASC:
                url = 'http://ui-grid.info/data/100_ASC.json';
                break;
            case uiGridConstants.DESC:
                url = 'http://ui-grid.info/data/100_DESC.json';
                break;
            default:
                url = 'http://ui-grid.info/data/100.json';
                break;
        }

        $http.get(url)
            .then(function (response) {
                var data = response.data;

                $scope.gridOptions.totalItems = 100;
                var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                $scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptions.pageSize);
            });

        var first = db.collection("test")
            .orderBy("gender")
            .limit(paginationOptions.pageSize);

        return first.get().then(function (documentSnapshots) {
            // Get the last visible document
            var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            console.log("last", lastVisible);

            // Construct a new query starting at this document,
            // get the next 25 cities.
            var next = db.collection("cities")
                .orderBy("population")
                .startAfter(lastVisible)
                .limit(25);
        });
    };


    //   firestore.collection("test").onSnapshot(function (snapshot){
    //     snapshot.docChanges.forEach(function (doc){
    //         console.log(doc.data())
    //       })
    //   })


    getPage();
});