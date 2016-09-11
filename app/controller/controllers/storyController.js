var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('newStoryForm', {
        url : '/newStory',
        templateUrl : 'newStory.html',
        controller : 'storyController'
    });

    $stateProvider.state('newStoryForm.storyBasic', {
        url : '/storyBasic',
        templateUrl : 'storyBasic.html',
        controller : 'storyBasicController'
    });

    $stateProvider.state('newStoryForm.storyCarousel', {
        url : '/storyCarousel',
        templateUrl : 'storyCarousel.html',
        controller : 'storyCarouselController'
    });

    $stateProvider.state('newStoryForm.storyTags', {
        url : '/storyTags',
        templateUrl : 'storyTags.html',
        controller : 'storyTagsController'
    });

    $urlRouterProvider.otherwise('/newStory/storyBasic');
});

app.controller("storyController1", function ($scope, $firebaseArray) {
    $scope.formdata = {};

    $scope.processForm = function () {
        alert('awesome!');
    };
});


