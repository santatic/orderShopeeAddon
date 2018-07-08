app.controller("home-controller", function ($scope, moment) {
//     $scope.msg = "I love 34325";
//     var todayCount = []
//     var yesterdayCount = []
//     var today = new Date()
//     var date = new Date()
//     yesterday = date.setDate(date.getDate() - 1);
//     var sevenDay = []
//     var sevenCount = []
//     for (let i = 1; i <= 7; i++) {
//         var seven = new Date()
//         var sevenDate = seven.setDate(seven.getDate() - i);
//         sevenDay.push(moment(sevenDate).format("YYYY-MM-DD").toString());
//     }
//     var thisMonth = moment(today).format("YYYY-MM")
//     var monthCount = []
//     console.log(thisMonth);
//     // console.log(moment(date).format("YYYY-MM-DD").toString());
//     // console.log(moment(date).format);
//     var paidToday = []
//     var paidYesterday = []
//     var paidSeven = []
//     var paidMonth = []
//     chrome.storage.local.get('data', function (keys) {
//         keys.data.forEach(doc => {
//             const data = doc
//             var create_at = moment(data.create_at.seconds * 1000).format("YYYY-MM-DD").toString();
//             var month = moment(data.create_at.seconds * 1000).format("YYYY-MM").toString()
//             var buyer_paid = parseInt((data.buyer_paid_amount)*100)/100

//             if (thisMonth == month) {
//                 monthCount.push(doc.id)
//                 paidMonth.push(buyer_paid)
//             }
//             // console.log(create_at);
//             sevenDay.forEach(function (val) {
//                 if (create_at == val) {
//                     // console.log("today: ", create_at);
//                     sevenCount.push(doc.id)
//                     paidSeven.push(buyer_paid)
//                 }
//             })

//             if (create_at == moment(today).format("YYYY-MM-DD")) {
//                 // console.log("today: ", create_at);
//                 paidToday.push(buyer_paid)
//                 todayCount.push(doc.id)
//             } else if (create_at == moment(yesterday).format("YYYY-MM-DD")) {
//                 // console.log("yesterday: ", create_at);
//                 yesterdayCount.push(doc.id)
//                 paidYesterday.push(buyer_paid)
//             }  
//         })
//     })
//     firestore.collection('orderShopee').get().then(function (querySnapshot) {
//         querySnapshot.forEach(doc => {
                      
//         });
//         var sumToday = 0
//         paidToday.forEach(function(num){sumToday+=num});
//         console.log(sumToday.toLocaleString());
//         $scope.sumToday = sumToday

//         var sumYes = 0
//         paidYesterday.forEach(function(num){sumYes+=num});
//         $scope.sumYes = sumYes

//         var sumSeven = 0
//         paidSeven.forEach(function(num){sumSeven+=num});
//         $scope.sumSeven = sumSeven

//         var sumMonth = 0
//         paidMonth.forEach(function(num){sumMonth+=num});
//         $scope.sumMonth = sumMonth

//         $scope.seven = sevenCount.length
//         $scope.today = todayCount.length
//         $scope.yesterday = yesterdayCount.length
//         $scope.month = monthCount.length
//         $scope.$apply()
//     })
//     var newOrder
//     var packedOrder
//     var preparedOrder
//     var unpreparedOrder
//     firestore.collection('orderShopee').where("own_status", "==", "NEW").get().then(querySnapshot => {
//         newOrder = querySnapshot.size
//     })
//     firestore.collection('orderShopee').where("own_status", "==", "PACKED").get().then(querySnapshot => {
//         packedOrder = querySnapshot.size
//     })
//     firestore.collection('orderShopee').where("own_status", "==", "PREPARED").get().then(querySnapshot => {
//         preparedOrder = querySnapshot.size
//     })
//     firestore.collection('orderShopee').where("own_status", "==", "UNPREPARED").get().then(querySnapshot => {
//         unpreparedOrder = querySnapshot.size
//     })
//     var timer = setInterval(function(){
//         if (newOrder > 0) {
//             $scope.donutLabels = ["ĐƠN MỚI", "ĐƠN ĐÃ ĐÓNG GÓI", "ĐỦ HÀNG", "THIẾU HÀNG"];
//             $scope.donutData = [newOrder, packedOrder, preparedOrder, unpreparedOrder];
//             $scope.$apply()
//             clearInterval(timer)
//         }
//     },500)
    
});