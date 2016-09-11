var firebaseUrl = "https://askoliv.firebaseio.com/";
var uploadUrl = "gs://askoliv.appspot.com/";
var fireRef = new Firebase(firebaseUrl);
var auth = firebase.auth();
// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();
app.controller("StoryController", function ($scope, $log, $firebaseArray) {
    console.log("entering storyController");
    var storyRef = fireRef.child("stories");
    $scope.stories = $firebaseArray(storyRef);
    console.log("got stories");


    $scope.carouselX = [];

    $scope.addNewCarouselItem = function() {
        var newItemNo = $scope.carouselX.length+1;
        $scope.carouselX.push({'id':'carouselItem'+newItemNo});
    };

    $scope.removeCarouselItem = function() {
        var lastItem = $scope.carouselX.length-1;
        $scope.carouselX.splice(lastItem);
    };

    //$scope.uploadImage = function () {
        /*var fileUpload = document.getElementById("fileUpload");
        fileUpload.on('change', function (evt) {
            var firstFile = evt.target.file[0]; // get the first file uploaded
            var uploadTask = storageRef.put(firstFile);
            uploadTask.on('state_changed', function progress(snapshot) {
                console.log(snapshot.totalBytesTransferred); // progress of upload
            });
        });
    };*/


   // $scope.upload_image = function (image) {
        /* if (!image.valid) return;

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
        imagesRef = new Firebase(uploadUrl + '/images');

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
    };*/
    /*console.log("image upload initiated");
    var fileUpload = document.getElementById("fileUpload");
    fileUpload.on("change", function(evt) {
        var firstFile = evt.target.file[0]; // get the first file uploaded
        var uploadTask = storageRef.child('images/' + firstFile.name).put(firstFile);
        console.log("image uploaded");
    });*/

    //$scope.uploadFile = function(files) {
        /*var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);
    
        $http.post(uploadUrl, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(" ...all right!... ").error(" ...damn!... ");
    
    };*/

  /*  $scope.$watch('stories', function () {
        $scope.stories.forEach(function (story) {
            if(!story || !story.title){
                return;
            }
            if(!$scope.story){
                $scope.story = story;
                getStories($scope, $firebaseArray);
            }
        });
    },true);*/

    /*$scope.selectStory = function (setStory) {
        $scope.story = setStory;
        getStories($scope, $firebaseArray);
    };
    $scope.isStorySelected = function (checkSID) {
        return ($scope.story.$id.localeCompare(checkSID) === 0);
    };
*/
    //Submit the Story
    $scope.author='';
    $scope.title='';
    $scope.subtitle='';
    $scope.category='';
    //$scope.subCategory='';
    $scope.textInitial='';
    
    $scope.submitStory = function () {
        console.log("submit initiated");
        //var carouselY = ;
        var carouselMap = {};
        for (var i = 0; i < $scope.carouselX.length; i++) {
            var key = $scope.carouselX[i].id;
            carouselMap[key] = {
                position: parseInt($scope.carouselX[i].position),
                text: $scope.carouselX[i].text,
                image: $scope.carouselX[i].image
            };
        }
        var newStory = {
            author: $scope.author,
            title : $scope.title,
            subtitle : $scope.subtitle,
            category : $scope.category,
            //subCategory : $scope.subCategory,
            textInitial : $scope.textInitial,
            carousel : carouselMap,
            published : true,
            timePublished : Firebase.ServerValue.TIMESTAMP
        };
        console.log("adding new story");
        if($scope.stories) {
            $scope.stories.$add(newStory).then(function (ref) {
                var id = ref.key();
                console.log("added story with id " + id);
                $scope.author = '';
                $scope.title = '';
                $scope.subtitle = '';
                $scope.category = '';
                //$scope.subCategory = '';
                $scope.textInitial = '';
                $scope.carouselX = [];
            });
        }

    };
    $scope.draftStory = function () {
        console.log("draft initiated");
        var carouselMap = {};
        for (var i = 0; i < $scope.carouselX.length; i++) {
            var key = $scope.carouselX[i].id;
            carouselMap[key] = {
                position: parseInt($scope.carouselX[i].position),
                text: $scope.carouselX[i].text,
                image: $scope.carouselX[i].image
            };
        }
        var newStory = {
            author: $scope.author,
            title : $scope.title,
            subtitle : $scope.subtitle,
            category : $scope.category,
            //subCategory : $scope.subCategory,
            textInitial : $scope.textInitial,
            carousel : carouselMap,
            published : false,
            timePublished : Firebase.ServerValue.TIMESTAMP
        };
        console.log("drafting new story");
        if($scope.stories) {
            $scope.stories.$add(newStory).then(function (ref) {
                var id = ref.key();
                console.log("drafted story with id " + id);
                $scope.author = '';
                $scope.title = '';
                $scope.subtitle = '';
                $scope.category = '';
                //$scope.subCategory = '';
                $scope.textInitial = '';
                $scope.carouselX = [];
            });
        }
    };

    $scope.showTitle = '';
    $scope.showStory = function () {
        console.log("showing story");
        
    };

    //$scope.onFileSelect = function($files) {
        /*//$files: an array of files selected, each file has name, size, and type.
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
    };*/

    //tagging structure for story
    /*var tagRef = fireRef.child("tags");

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

    },true);*/
});

//image upload
/*app.controller('ImageUpload', ['$scope', '$log',
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
*/

//tagController
/*app.controller("TagController", function ($scope, $firebaseArray, $firebaseObject) {
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

});*/


//app.controller("SController", function ($scope, $firebaseArray) {
/*    var storyRef = fireRef.child('stories');
    $scope.stories = $firebaseArray(storyRef);

    $scope.storyNames = [];
    $scope.$watch('stories',function () {
        $scope.stories.forEach(function (story) {
            if(!story || !story.title){
                storyNames.push(story.title);
            }
        });
    },true);

    $scope.selectedStory = '';
    // this.searchHistory = [];
    // this.searchStory = function (story) {
    //     searchHistory.push(story.title);
    // }
    this.openStory = function(story){
        console.log("submitting story!");
    }
});*/

//imageUpload
/*function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var metadata = {
        'contentType': file.type
    };
    // Push to child path.
    // [START oncomplete]
    console.log("storing image");
    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log("uploaded");
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.metadata.downloadURLs[0];
        console.log('File available at', url);
        // [START_EXCLUDE]
        document.getElementById('linkBox').innerHTML = '<a href="' +  url + '">Click For File</a>';
        // [END_EXCLUDE]
    }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
    });
    // [END oncomplete]
}
function uploadImage(){
// window.onload = function() {
    console.log("upload1");
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
    console.log("upload2");
    document.getElementById('file').disabled = true;
    console.log("upload3");
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('Anonymous user signed-in.', user);
            document.getElementById('file').disabled = false;
        } else {
            console.log('There was no anonymous session. Creating a new anonymous user.');
            // Sign the user in anonymously since accessing Storage requires the user to be authorized.
            auth.signInAnonymously();
        }
    });
}
*/
