app.controller("chatCtrl", function ($scope, $location, $anchorScroll, moment) {
    $scope.msg = "";

    $scope.time = moment().format().toString()
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            chrome.browserAction.setBadgeText({
                text: ''
            });
            chrome.storage.local.get('chat', function (keys) {
                getChats(keys.chat)

            })
            chrome.storage.onChanged.addListener(function (changes) {
                if (changes.chat) getChats(changes.chat.newValue);
            })

            $scope.items = [];

            var counter = 0;
            // $scope.loadMore = function () {
            //     for (var i = 0; i < 10; i++) {
            //         $scope.items.unshift({ id: counter });
            //         counter += 10;
            //     }
            // };

            // $scope.loadMore();

            function getChats(chats) {
                $scope.arr = []
                $scope.chats = []
                var begin = 0
                var end = 5
                var count = 0   
                $scope.loadMore = function () {
                    var arrSlice = chats.slice(begin, end)
                    console.log(arrSlice);
                    arrSlice.forEach(function (chat) {
                        // console.log(chat.messages);
                        if(count > 0)  chat.messages.reverse()
                        chat.messages.forEach(function (mes) {
                            count == 0? $scope.chats.push(mes): $scope.chats.unshift(mes);
                            if (moment().format('YYYY-MM-DD').toString() == chat.id.toString()) {
                                $scope.arr.push(mes);
                            }
                        })
                        count++
                    })
                    begin += 5;
                    end += 5;
                    
                };

                $scope.loadMore();

                $scope.myuid = user.uid
                $scope.name = user.displayName
                $scope.time = moment(chats.create_at).format().toString()
                $scope.$apply()
                // var d = $('#chat');
                
                // d.animate({
                //     scrollTop: d.prop('scrollHeight')
                // }, 200);
                // chrome.storage.local.get('badge', function (obj) {
                //     if (Object.keys(obj).length === 0) {
                //         chrome.storage.local.set({
                //             badge: 0
                //         });
                //     } else {
                //         chrome.storage.local.set({
                //             badge: 0
                //         });
                //     }
                // })
            }

        }
    });
    $("div#footer textarea").on('keypress', function (e) {
        if (e.which == 13 && !e.shiftKey) {
            e.preventDefault();
            $scope.sendMsg()
        } else if (e.which == 13 && e.shiftKey) {
            e.preventDefault();
            $(this).val($(this).val() + "\n");
            console.log($(this).val());
        }

    });
    $scope.sendMsg = function () {

        if ($("div#footer textarea").val() !== "") {
            $scope.arr.push({
                content: $("div#footer textarea").val(),
                from: {
                    uid: $scope.myuid,
                    name: $scope.name
                },
                time: new Date().getTime()
            })

            $scope.arr = JSON.parse(angular.toJson($scope.arr));
            console.log($scope.arr);
            // $scope.msg = ""
            firestore.collection("chats").doc(moment().format('YYYY-MM-DD').toString())
                .set({
                    create_at: $scope.time,
                    messages: $scope.arr
                }).then(function () {
                    $("div#footer textarea").val("")
                })

        }
    }
});