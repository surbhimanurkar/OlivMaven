var firebaseUrl = "https://askoliv.firebaseio.com/";
var uploadUrl = "gs://askoliv.appspot.com/";
var fireRef = new Firebase(firebaseUrl);
var auth = firebase.auth();
/*var storage = firebase.storage();
var storageRef = storage.ref();*/
app.controller("TipsController", function ($scope, $log, $firebaseArray) {
    console.log("entering tipsController");
    var tipRef = fireRef.child("suggestions");
    $scope.tips = $firebaseArray(tipRef);
    console.log($scope.tips);

    var tagRef = fireRef.child("tags");

    $scope.tags = $firebaseArray(tagRef.orderByKey());
    $scope.$watch('tags',function () {
        $scope.tags.forEach(function (tag) {
            if(!tag || !tag.$id){
                return;
            }
        });
    },true);
    console.log('1');
    console.log($scope.tags);
    $scope.queryTag = '';
    $scope.selectedTags = [];
    $scope.selectTag = function (tag) {
        if($scope.selectedTags.indexOf(tag) === -1){
            console.log('2');
            $scope.selectedTags.push(tag);
            var index = $scope.tags.indexOf(tag);
            $scope.tags.splice(index, 1);
        }
    };
    $scope.unselectTag = function (tag) {
        console.log('3');
        var index = $scope.selectedTags.indexOf(tag);
        $scope.selectedTags.splice(index, 1);
        $scope.tags.push(tag)
    };

    $scope.newTag = '';
    $scope.myTxt = '';
    $scope.addTag = function () {
        var tag = {popularity : 50};
        if($scope.tags){
            /*tagRef.set({
                tagName : {popularity : 50}
            },function(error) {
                if (error) {
                    alert("Tag could not be added." + error);
                } else {
                    alert("Tag added successfully.");
                }
            });*/
            tagRef.child($scope.newTag).set(tag,function(error) {
                $scope.newTag = '';
                if (error) {
                    alert("Tag could not be added." + error);
                } else {
                    alert("Tag added successfully.");
                }
            });/*.then(function(ref){
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.newTag= '';
            });
            $scope.myTxt = "tag added.";*/
        }
    };

    /*$scope.category = '';
    $scope.subCategory = '';*/
    $scope.url = '';
    $scope.tip = '';
    $scope.submitTip = function () {
        console.log('4');
        var tagsObject = {};
        console.log($scope.selectedTags);
        for (var i = 0; i < $scope.selectedTags.length; i++) {
            var key = $scope.selectedTags[i].$id;
            console.log('5-'+i);
            tagsObject[key] = true;
        }
        var newTip = {
            /*category : $scope.category,
            subCategory : $scope.subCategory,*/
            text : $scope.tip,
            tags : tagsObject,
            image : $scope.url
        };
        console.log(tagsObject);

        if ($scope.tips) {
            console.log('6');
            $scope.tips.$add(newTip).then(function (ref) {
                console.log('7');
                var id = ref.key();
                console.log("added Tip with id " + id);
                var newSug = {};
                newSug[id] = true;
                for (var j = 0; j < $scope.selectedTags.length; j++) {
                    console.log('7-'+j);
                    tagsObject[key] = true;
                    var currentTag = $scope.selectedTags[j].$id;
                    tagRef.child(currentTag).child('suggestions/').set(newSug);
                }
                /*$scope.category = '';
                $scope.subCategory = '';*/
                $scope.tip = '';
                $scope.url = '';
            });
        }
    };

    $scope.loadTip = function() {
        console.log('tip1');
        document.getElementById('fileTip').addEventListener('change', handleFileSelected, false);
        document.getElementById('fileTip').disabled = true;
        auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log('tip2');
                console.log('Anonymous user signed-in.', user);
                document.getElementById('fileTip').disabled = false;
            } else {
                console.log('tip2-1');
                console.log('There was no anonymous session. Creating a new anonymous user.');
                auth.signInAnonymously();
            }
        });
    };
    function handleFileSelected(evt) {
        console.log('tip3');
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];
        var metadata = {
            'contentType': file.type
        };
        storageRef.child('tips/' + file.name).put(file, metadata).then(function(snapshot) {
            console.log('tip4');
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            $scope.url = snapshot.metadata.downloadURLs[0];
            console.log('File available at', $scope.url);
        }).catch(function(error) {
            console.log('tip5-1');
            console.error('Upload failed:', error);
        });
    }
});


/*
app.controller("TagsController", function ($scope, $firebaseArray, $firebaseObject) {
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
