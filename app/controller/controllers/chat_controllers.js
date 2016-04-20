var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
app.controller("ChatController", function ($scope, $firebaseArray) {

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

    //Retrieving text for open-assigned-button
    $scope.getOpenAssignedButtonText = function () {
        if($scope.user && $scope.user.status && ($scope.user.status === 'OPEN')){
            return 'Assign';
        }else{
            return 'Open';
        }
    };

    $scope.isOpen = function (checkUser) {
        return checkUser.status === 'OPEN';
    };
    
});
function getChats ($scope, $firebaseArray) {
    var chatRef = fireRef.child("chat").child($scope.user.$id);

    //Retrieving Chats
    $scope.chats = $firebaseArray(chatRef.orderByChild('time'));
    $scope.$watch('chats', function () {
        $scope.chats.forEach(function (chat) {
            // Skip invalid entries so they don't break the entire app.
            if (!chat || !chat.message) {
                return;
            }
        });
    }, true);

};
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
        }
    };
    $scope.unselectTag = function (tag) {
        var index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);
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