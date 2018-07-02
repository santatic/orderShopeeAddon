// var config = {
// 	apiKey: 'AIzaSyB5a-MpgrGUzsGUntJW6vSE_oryGxeN7jw',
// 	authDomain: 'shopee.vn',
// 	databaseURL: 'https://test-f8d9d.firebaseio.com',
// 	storageBucket: 'test-f8d9d.appspot.com'
// };
// firebase.initializeApp(config);


var app = angular.module("myapp", ['angularMoment']); //"firebase"

app.config(function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);
});

app.service('Chat', function () {
    this.getSuggests = function () {
        var states = []
        chrome.storage.local.get('suggests', function (keys) {
            keys.suggests.forEach(function (val) {
                states.push(val.suggest_chat)
            })
        })
        // var states = Chat;
        var timer = setInterval(function () {

            var input = $('.shopee-chat-root .chat-panel textarea')
            input.keyup(function () {
                $('.shopee-chat-root .shopee-chat__scrollable').scrollTop($('.shopee-chat-root .shopee-chat__scrollable')[0].scrollHeight)
            })

            if (input.length && (states.length > 0)) {

                // $('div.chat-panel').prepend('<div class="suggest"></div>')

                console.log("here");

                clearInterval(timer)

                input.autocomplete({
                    delay: 100,
                    minLength: 1,
                    source: states,
                    appendTo: 'div.chat-content',
                    // focus: function (event, ui) {
                    //     // prevent autocomplete from updating the textbox
                    //     event.preventDefault();
                    // },
                    // select: function (event, ui) {
                    //     // alert(input.val());
                    //     console.log(ui.item.value)
                    // }
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    // console.log(item.label);

                    $('.shopee-chat-root .shopee-chat__scrollable').scrollTop($('.shopee-chat-root .shopee-chat__scrollable')[0].scrollHeight)

                    return $("<li style='cursor: pointer' >" + item.label + "</li>").appendTo(ul);

                };



            } else {
                console.log("notyet");
            }
        }, 500)
    }

})

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