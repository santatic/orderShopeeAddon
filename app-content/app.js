// var config = {
// 	apiKey: 'AIzaSyB5a-MpgrGUzsGUntJW6vSE_oryGxeN7jw',
// 	authDomain: 'shopee.vn',
// 	databaseURL: 'https://test-f8d9d.firebaseio.com',
// 	storageBucket: 'test-f8d9d.appspot.com'
// };
// firebase.initializeApp(config);


var app = angular.module("myapp", ['angularMoment','ui.bootstrap']); //"firebase"

app.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

// app.factory('Chat', function () {
    // var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
//     return states;
// })

app.factory('dataService', function () {
    // var users = [
    //     { id: 1, username: 'john' }
    // ];
    var xxx = GLOBAL_FIRST_RESPONSE;
    return {
        getItem: function (id) {
            return GLOBAL_FIRST_RESPONSE === null ? null : GLOBAL_FIRST_RESPONSE;
            // for (i=0; i<users.length; i++) {
            //     if (users[i].id === id) {
            //         return users[i];
            //     }
            // }
        }
    };
});
// app.factory("Auth", ["$firebaseAuth",
//   function($firebaseAuth) {
//     return $firebaseAuth();
//   }
// ]);