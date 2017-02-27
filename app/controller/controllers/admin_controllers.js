var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);

app.controller("AdminController", function ($scope, $firebaseArray, $firebaseObject) {
    var configRef = fireRef.child('config');
    $scope.chatActive = false;
    getActive($scope);
    $scope.active;
    $scope.changeState = function (){
        console.log("active changed to : " + $scope.active );
        if($scope.active == "true"){
            configRef.update({active : true});
        } else {
            configRef.update({active : false});
        }
    };
});
function getActive($scope) {
    var configActiveRef = fireRef.child('config').child('active');
    configActiveRef.transaction(function (currentValue) {
        $scope.chatActive = currentValue;
        return currentValue;
    }, function(){}, false);
}
