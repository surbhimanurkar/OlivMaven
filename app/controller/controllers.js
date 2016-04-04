var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
app.controller("TabController", function () {
    this.tab = 1;
    this.selectTab = function (setTab) {
        this.tab = setTab;
    };
    this.isSelected = function (checkTab) {
        return this.tab === checkTab;
    };
});
app.controller("UserController", function ($scope, $firebaseArray) {
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
    $scope.selectConversation = function (setUser) {
        $scope.user = setUser;
        getChats($scope, $firebaseArray);
    };
    $scope.isUserSelected = function (checkUID) {
        return ($scope.user.$id.localeCompare(checkUID) === 0);
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