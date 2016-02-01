/**
 * Created by edgarisla1 on 1/19/16.
 */
// define our app and dependencies (remember to include firebase!)
//var app = angular.module("app", ["firebase"]);
var app = angular.module("app", ["ngResource"]);

// this factory returns a synchronized array of chat messages
app.factory("chatMessages", ["$resource",
    function($resource) {
        // create a reference to the database location where we will store our data
        var resource = $resource("https://luminous-torch-9391.firebaseio.com/ChatRoom/:id.json" ,
            {id: "@id"},
            {
                update: {method: "PATCH"}
            }
        );
        // this uses resource to create the synchronized array
        return resource;
    }
    ]);
//]);app.factory("chatMessages", ["$firebaseArray",
//    function($firebaseArray) {
//        // create a reference to the database location where we will store our data
//        var randomRoomId = Math.round(Math.random() * 100000000);
//        var ref = new Firebase("https://luminous-torch-9391.firebaseio.com/ChatRoom");
//
//        // this uses AngularFire to create the synchronized array
//        return $firebaseArray(ref);
//    }
//]);
    app.factory("Auth", function($firebaseAuth) {
    var ref = new Firebase("https://luminous-torch-9391.firebaseio.com/");
    return $firebaseAuth(ref);

});
app.controller("authCtrl", function($scope,Auth) {

    $scope.login = function () {
        Auth.$authWithOAuthPopup("github").then(function(authData) {
            console.log(authData);
        }).catch(function (error) {
            console.log(error);
        });
    };

    $scope.logout = function () {
        Auth.$unauth();

    };
});

app.controller("ChatCtrl", ["$scope", "chatMessages",
    // we pass our new chatMessages factory into the controller
    function($scope, chatMessages) {

        $scope.message= "";
        // we add chatMessages array to the scope to be used in our ng-repeat
        $scope.messages = chatMessages.get();

        // a method to create new messages; called by ng-submit
        $scope.addMessage = function() {
            // calling $add on a synchronized array is like Array.push(),
            // except that it saves the changes to our database!
            //$scope.messages.$add({
            //    from: $scope.user,
            //    content: $scope.message
            //});



            chatMessages.save({
                from: $scope.user,
                content: $scope.message

            }, function () {
                    $scope.messages=chatMessages.get();
                }
            );








            // reset the message input
            $scope.message = "";
        };

        $scope.deleteMessage= function (key) {
          console.log("deleting key:" + key );

            //this deletes works
            //$scope.entry= chatMessages.get({id: key}, function () {
            //    $scope.entry.$delete({id: key}, function () {
            //        console.log("delete successful!" );
            //        $scope.messages = chatMessages.get();
            //    });
            //
            //});

            (new chatMessages()).$delete({id: key}, function () {
               console.log("delete successful");
                $scope.messages= chatMessages.get();
            });
        };
        $scope.updateMessage = function (key) {
            var newVal= window.prompt("new Value?");

            console.log("new value" + key + ":"  + newVal);
            

        };
        // if the messages are empty, add something for fun!
        //$scope.messages.$loaded(function() {
        //    if ($scope.messages.length === 0) {
        //        $scope.messages.$add({
        //            from: "Firebase Docs",
        //            content: "Hello world!"
        //        });
        //    }
        //});
    }
]);
