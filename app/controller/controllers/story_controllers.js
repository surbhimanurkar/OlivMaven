/**
 * Created by veerni on 7/11/2016.
 */
var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
app.controller("StoryController", '$scope', '$upload', function ($scope, $firebaseArray, $upload, $firebaseObject) {


    var storyRef = fireRef.child('stories')/*.orderByChild('status').equalTo('publish')*/;
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
    $scope.newStory = {};
    $scope.submitStory = function (newStory) {
        /*var newCarouselItem = {
            id : $scope.story.title + $scope.carouselItem.position,
            image : $scope.carouselItem.image,
            position : $scope.carouselItem.position,
            text : $scope.carouselItem.text
        };
        var newStory = {
            id : $scope.story.title + $scope.story.author,
            author: $scope.story.author,
            title : $scope.story.title, 
            subTitle : $scope.story.subTitle,
            category : $scope.story.category,
            subCategory : $scope.story.subCategory,
            tags : $scope.story.tags,
            textInitial : $scope.story.textInitial,
            carousel : $scope.story.carousel,
            status : $scope.story.status,
            submissionTime : Firebase.ServerValue.TIMESTAMP
        };
        if(!$scope.title.length){
            return;
        }*/
        if($scope.stories){
            $scope.stories.$child(newStory.id).$set(newStory);
            //$scope.stories.(newStory.id).carousel.$set();
        }
    };

    $scope.carousel = {
        Item : [ new CarouselItem() ]
    }

    $scope.addCarousel = function() {
        $scope.carousel.Item.push( new CarouselItem() );
    };

    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: 'gs://askoliv.appspot.com/', //upload.php script, node.js route, or servlet url
                data: {myObj: $scope.myModelObj},
                file: file,
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                // file is uploaded successfully
                console.log(data);
            });
        }
    };

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

function getStories($scope, $firebaseArray) {

};

function CarouselItem() {
    this.image = null;
    this.position = null;
    this.text = null;
}

app.controller('ImageUpload', ['$scope', '$log',
    function ImageUpload($scope, $log) {
        $scope.upload_image = function (image) {
            if (!image.valid) return;

            var imagesRef, safename, imageUpload;

            image.isUploading = true;
            imageUpload = {
                isUploading: true,
                data: image.data,
                thumbnail: image.thumbnail,
                name: image.filename,
                author: {
                    provider: $scope.auth.user.provider,
                    id: $scope.auth.user.id
                }
            };

            safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");
            imagesRef = new Firebase($scope.firebaseUrl + '/images');

            imagesRef.child(safename).set(imageUpload, function (err) {
                if (!err) {
                    imagesRef.child(safename).child('isUploading').remove();
                    $scope.$apply(function () {
                        $scope.status = 'Your image "' + image.filename + '" has been successfully uploaded!';
                        if ($scope.uploaded_callback !== undefined) {
                            $scope.uploaded_callback(angular.copy(imageUpload));
                        }
                        image.isUploading = false;
                        image.data = undefined;
                        image.filename = undefined;
                    });
                }else{
                    $scope.error = 'There was an error while uploading your image: ' + err;
                }
            });
        };
    }
]);


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