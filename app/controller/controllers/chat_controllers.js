var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
app.controller("ChatController", function ($scope, $http, $log, $firebaseArray) {

    //Retrieving users
    var userRef = fireRef.child('user').orderByChild('resolved').equalTo(false);
    $scope.users = $firebaseArray(userRef);

    $scope.$watch('users', function () {
        $scope.users.forEach(function (user) {
            if(!user || !user.username){
                return;
            }
            if(!$scope.user){
                $scope.user = user;
                getChats($scope, $firebaseArray);
            }
        });
    },true);

    //Selecting user
    $scope.selectConversation = function (setUser) {
        $scope.user = setUser;
        getChats($scope, $firebaseArray);
        //getProfileInfo(setUser);
        //getProfilePicture(setUser);
    };
    $scope.isUserSelected = function (checkUID) {
        return ($scope.user.$id.localeCompare(checkUID) === 0);
    };
    
    //Replying to chat
    $scope.reply = '';
    $scope.sendReply = function () {
        var chat = {author: 1, message: $scope.reply.trim(), time: Firebase.ServerValue.TIMESTAMP};
        if(!$scope.reply.length){
            return;
        }
        if($scope.chats){
            $scope.chats.$add(chat).then(function(ref){
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.reply = '';
                console.log("initiating notification");
                sendChatNotification($scope, $http);
            });
        }

    };

    $scope.setReply = function(newReply){
      $scope.reply = newReply;
    };

    //Mark user chats as resolved
    $scope.markResolved = function(){
        var newUser = $scope.user;
        newUser.resolved = true;
        $scope.user = null;
        $scope.users.$save(newUser);
    };


    //Mark user chats as open/assigned/inProgress
    $scope.changeStatus2 = function(){
        if($scope.user.status === 'OPEN'){
            $scope.user.status = 'ASSIGNED';
            $scope.users.$save($scope.user);
        }else if($scope.user.status === 'ASSIGNED'){
            $scope.user.status = 'INPROGRESS';
            $scope.users.$save($scope.user);
        }else if($scope.user.status === 'INPROGRESS'){
            $scope.user.status = 'OPEN';
            $scope.users.$save($scope.user);
        }
    };


    //Mark user chats as open/assigned
    $scope.changeStatus = function(){
        if($scope.user.status === 'OPEN'){
            $scope.user.status = 'ASSIGNED';
            $scope.users.$save($scope.user);
        }else if($scope.user.status === 'ASSIGNED'){
            $scope.user.status = 'OPEN';
            $scope.users.$save($scope.user);
        }
    };

    //Retrieving text for open-assigned-process-button
    $scope.getOpenAssignedButtonText = function () {
        if($scope.user && $scope.user.status && ($scope.user.status === 'OPEN')){
            return 'Assign';
        }else if($scope.user && $scope.user.status && ($scope.user.status === 'ASSIGNED')){
            return 'Process';
        }else{
            return 'Open';
        }
    };

    // $scope.getProfileInfo = function (setUser) {
    //     if ($scope.user.profileInfo) {
    //         return $scope.user.profileInfo;
    //     } else {
    //         return;
    //     }
    // };

    // $scope.getProfilePicture = function () {
    //     if ($scope.user.image) {
    //         return $scope.user.image;
    //     } else {
    //         return;
    //     }
    // };

    $scope.isOpen = function (checkUser) {
        return checkUser.status === 'OPEN';
    };
    
});

function sendChatNotification($scope, $http) {
    var userId = $scope.user.$id;
    var jsonBody = {
        "group_id": "messages",
        "priority":"normal",
        "recipients": {
            "custom_ids": ["userId"]
        },
        "message": {
            "title": "Parapluie",
            "body": "You have new messages!"
        },
        "deeplink": "https://k2a92.app.goo.gl/EawQ",
        "gcm_collapse_key": {
            "enabled": true,
            "key": "default"
        }
    };
    var BATCH_API_KEY = "DEV57A08F6E6FE36C56522B32FFB78";
    var BATCH_REST_API_KEY = "722a39c52cddcd0a6bc66cb8bf58da71";
    var batch_url = "https://api.batch.com/1.0/"+BATCH_API_KEY+"/transactional/send";
    var req = {
        method: 'POST',
        url: batch_url,
        data: JSON.stringify(jsonBody),
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": BATCH_REST_API_KEY
        }
    };
    $http(req).success(function(jsonBody) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("User Id: "+ userId);
        console.log("successfully posted the notification");
    }).error(function(jsonBody) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("error while pushing the notification");
    });
}

function getChats ($scope, $firebaseArray) {
    var chatRef = fireRef.child("chat").child($scope.user.$id);

    //Retrieving Chats
    $scope.chats = $firebaseArray(chatRef.orderByChild('time'));
    $scope.$watch('chats', function () {
        $scope.chats.forEach(function (chat) {
            // Skip invalid entries so they don't break the entire app.
            if (!chat.message) {//receive image too
                return;
            } else if (!chat.image){
                return;
            }
        });
    }, true);

}



app.controller("TagController", function ($scope, $firebaseArray, $firebaseObject) {
    var tagRef = fireRef.child("tags");

    $scope.tags = $firebaseArray(tagRef.orderByKey());
    $scope.$watch('tags',function () {
        $scope.tags.forEach(function (tag) {
            if(!tag || !tag.$id){
                return;
            }
        });
    },true);
    $scope.queryTag = '';
    $scope.selectedTags = [];
    $scope.selectTag = function (tag) {
        if($scope.selectedTags.indexOf(tag) === -1){
            $scope.selectedTags.push(tag);
            var index = $scope.tags.indexOf(tag);
            $scope.tags.splice(index, 1);
        }
    };
    $scope.unselectTag = function (tag) {
        var index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);
        $scope.tags.push(tag)
    };
    $scope.newTag = '';
    $scope.addTag = function (tag) {
        var tag = {name : tag, popularity : 50};
        if($scope.tags && tags.indexOf(tag)){
            $scope.myTxt = "tag already exists.";
        } else {
            $scope.tags.$child(tag.name).$set(tag).then(function(ref){
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.tag='';
            });
            $scope.myTxt = "tag added.";
        }
    };

    //Retrieving suggestions
    $scope.$watch('selectedTags',function(){
        $scope.suggestions = {};
        var suggestionsRef = fireRef.child("suggestions");
        $scope.selectedTags.forEach(function(selectedTag){
            if(selectedTag.suggestions){
                angular.forEach(selectedTag.suggestions, function (suggestionValue, suggestionKey) {
                    if(suggestionValue){
                        if($scope.suggestions[suggestionKey]){
                            $scope.suggestions[suggestionKey].matches += 1;
                        }else{
                            var suggestionObj = $firebaseObject(suggestionsRef.child(suggestionKey));
                            $scope.suggestions[suggestionKey] = {matches: 1, data: suggestionObj};
                        }
                    }
                });
            }
        });

    },true);

});