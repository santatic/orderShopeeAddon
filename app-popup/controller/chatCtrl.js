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


            function getChats(chats) {
                $scope.arr = []
                $scope.chats = []
                chats.forEach(function (chat) {
                    // console.log(chat.messages);
                    chat.messages.forEach(function (mes) {
                        $scope.chats.push(mes)                        
                        if (moment().format('YYYY-MM-DD').toString() == moment(chats.id).format('YYYY-MM-DD')) {
                            $scope.arr.push(mes);                            
                        }
                        $scope.$apply()
                        
                    })
                })
                $scope.myuid = user.uid
                $scope.name = user.displayName
                $scope.time = moment(chats.create_at).format().toString()              
                console.log($scope.chats);
                $scope.$apply()

                console.log($scope.chats);
                var d = $('#chat');
                d.animate({
                    scrollTop: d.prop('scrollHeight')
                }, 1000);
                chrome.storage.local.get('badge', function (obj) {
                    if (Object.keys(obj).length === 0) {
                        chrome.storage.local.set({
                            badge: 0
                        });
                    } else {
                        chrome.storage.local.set({
                            badge: 0
                        });
                    }
                })
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