/**
 * Created by veerni on 7/11/2016.
 */
var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
app.controller("StoryController", function ($scope, $firebaseArray) {


    var storyRef = fireRef.child('story').orderByChild('status').equalTo('publish');
    var stories = $firebaseArray(storyRef);

    $scope.$watch('stories', function () {
        $scope.stories.forEach(function (story) {
            if(!story || !story.title){
                return;
            }
            if(!$scope.story){
                $scope.story = story;
                getStories($scope, $firebaseArray);
            }
        });
    },true);

    $scope.selectStory = function (setStory) {
        $scope.story = setStory;
        getStories($scope, $firebaseArray);
    };
    $scope.isStorySelected = function (checkSID) {
        return ($scope.story.$id.localeCompare(checkSID) === 0);
    };

    //Submit the Story
    $scope.story = '';
    $scope.newStory = function () {
        var newStory = {author: newStory.author , message: $scope.reply.trim(), time: Firebase.ServerValue.TIMESTAMP};
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

});

function getStories($scope, $firebaseArray) {

};