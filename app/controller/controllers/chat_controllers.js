var firebaseUrl = "https://askoliv.firebaseio.com/";
var fireRef = new Firebase(firebaseUrl);
var uploadUrl = "gs://askoliv.appspot.com/";
var storage = firebase.storage();
var storageRef = storage.ref();
app.controller("ChatController", function ($scope, $http, $log, $firebaseArray) {

    //Retrieving users
    var userRef = fireRef.child('user').orderByChild('resolved').equalTo(false);
    $scope.users = $firebaseArray(userRef);
    /*$scope.allChats = [];
    $scope.users.forEach(function () {
        var chatRef = fireRef.child("chat").child($scope.user.$id);
        $scope.currentChat = $firebaseArray(chatRef.orderByChild('time'));
        $scope.allChats = $scope.allChats.concat($scope.currentChat);
        console.log('adding chats of - '+ $scope.user.$id + ' to allChats');
    });
    $scope.$watch('allChats',function () {
        console.log('playing sound when someone pings');
        var audio = new Audio('audio/oh-really.mp3');
        audio.play();
    });*/
    
    $scope.$watch('users', function () {
            var audio = new Audio('audio/glass_ping.mp3');
            audio.play();
        $scope.users.forEach(function (user) {
            if(!user || !user.username){
                return;
            }
            if(!$scope.user){
                $scope.user = user;
                /*var userId = $scope.user.$id;     
                $scope.user.once('value', function(snapshot) {
                    if (!snapshot.hasChild(status)) {
                        $scope.user.status = 'OPEN';
                        $scope.users.$save($scope.user);
                    }
                });*/
                $scope.userStatus = $scope.user.status;
                console.log($scope.userStatus);
                if(typeof $scope.userStatus === "undefined"){
                    $scope.user.status = 'OPEN';
                    $scope.users.$save($scope.user);
                }
                $scope.userStatus = $scope.user.status;
                console.log($scope.userStatus);
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
        /*function linkify(text) {
            var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return text.replace(urlRegex, function(url) {
                return '<a href="' + url + '">' + url + '</a>';
            });
        }
        if ($scope.reply) {
            $scope.urlFromText = linkify($scope.reply);
        }
        if ($scope.urlFromText) {
            $http({
                method: 'GET',
                url: $scope.urlFromText,
                responseType: 'arraybuffer'
            }).then(function(response) {
                console.log(response);
                var str = _arrayBufferToBase64(response.data);
                console.log(str);
                // str is base64 encoded.
            }, function(response) {
                console.error('error in getting static img.');
            });


            function _arrayBufferToBase64(buffer) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            }
        }*/

        var chat = {author: 1, message: $scope.reply.trim(), time: Firebase.ServerValue.TIMESTAMP, read: false};
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


    /*function handleFileSelect(evt) {
        console.log('4');
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];
        var metadata = {
            'contentType': file.type
        };
        console.log('5');
        storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
            console.log('6-1');
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            var url = snapshot.metadata.downloadURLs[0];
            console.log('File available at', url);
        }).catch(function(error) {
            console.log('6-2');
            console.error('Upload failed:', error);
        });
    }
    $scope.uploadImage = function(file) {
        console.log('1');
        var el = document.getElementById('file');
        if (el) {
            console.log('2');
            el.addEventListener('change', handleFileSelect, false);
            el.disabled = true;
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    console.log('3-1');
                    console.log('Anonymous user signed-in.', user);
                    el.disabled = false;
                } else {
                    console.log('3-2');
                    console.log('There was no anonymous session. Creating a new anonymous user.');
                    auth.signInAnonymously();
                }
            });
        }
    };*/
    /*$scope.image = '';
    $scope.url= '';
    $scope.uploadImage = function (image) {
        console.log("1");
        console.log(image);
        auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log("2-1");
                console.log('Anonymous user signed-in.', user);
            } else {
                console.log("2-2");
                console.log('There was no anonymous session. Creating a new anonymous user.');
                // Sign the user in anonymously since accessing Storage requires the user to be authorized.
                auth.signInAnonymously();
            }
        });
        storageRef.child('images/' + 'PP-1-' + Firebase.ServerValue.TIMESTAMP).put(image).then(function(snapshot) {
            console.log("3");
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            $scope.url = snapshot.metadata.downloadURLs[0];
            console.log('File available at', $scope.url);
        }).catch(function(error) {
            console.log("3-1");
            console.error('Upload failed:', error);
        });
        var chat = {author: 1, image: $scope.url, time: Firebase.ServerValue.TIMESTAMP};
        if($scope.chats && $scope.url !== ''){
            console.log("4");
            $scope.chats.$add(chat).then(function(ref){
                console.log("5");
                var id = ref.key();
                console.log("added record with id " + id);
                $scope.url = '';
                console.log("initiating notification");
                sendChatNotification($scope, $http);
            });
        }
    };*/

    /*$scope.uploadImage = function (image) {
        if (!image.valid) return;

        var imagesRef, safeName, imageUpload;

        var isUploading = true;

        safeName = image.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");
        imagesRef = storageRef.child('/images');

        imagesRef.child(safeName).put(image).then( function (err) {
            if (!err) {
                $scope.$apply(function () {
                    $scope.status = 'Your image "' + safeName + '" has been successfully uploaded!';
                });
            }else{
                $scope.error = 'There was an error while uploading your image: ' + err;
            }
            isUploading = false;
        });
    };*/
    
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

    $scope.load = function() {
        console.log('1');
        document.getElementById('file').addEventListener('change', handleFileSelect, false);
        document.getElementById('file').disabled = true;
        auth.onAuthStateChanged(function(user) {
            if (user) {
                console.log('2');
                console.log('Anonymous user signed-in.', user);
                document.getElementById('file').disabled = false;
            } else {
                console.log('2-1');
                console.log('There was no anonymous session. Creating a new anonymous user.');
                auth.signInAnonymously();
            }
        });
    };
    function handleFileSelect(evt) {
        console.log('3');
        evt.stopPropagation();
        evt.preventDefault();
        var file = evt.target.files[0];
        var metadata = {
            'contentType': file.type
        };
        storageRef.child('images/' + 'PP-' + (new Date().getTime()) +'-'+ file.name).put(file, metadata).then(function(snapshot) {
            console.log('4');
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            var url = snapshot.metadata.downloadURLs[0];
            console.log('File available at', url);
            var chat = {author: 1, image: url, time: Firebase.ServerValue.TIMESTAMP, read: false};
            if($scope.chats && url !== ''){
                console.log("5");
                $scope.chats.$add(chat).then(function(ref){
                    console.log("6");
                    var id = ref.key();
                    console.log("added record with id " + id);
                    $scope.url = '';
                    console.log("initiating notification");
                    sendChatNotification($scope, $http);
                });
            }
        }).catch(function(error) {
            console.log('5-1');
            console.error('Upload failed:', error);
        });
    }
});



function sendChatNotification($scope, $http) {
    var userId = $scope.user.$id;
    var jsonBody = {
        "group_id": "messages",
        "priority":"normal",
        "recipients": {
            "custom_ids": [userId]
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
    var BATCH_API_KEY = "57A08F6E6DF014CE1F01295225373A";
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
    $http(req).success(function(json) {
        // this callback will be called asynchronously
        // when the response is available
        console.log(json);
        console.log("User Id: "+ userId);
        console.log("successfully posted the notification");
    }).error(function(json) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(json);
        console.log("error while pushing the notification");
    });
}

function getChats ($scope, $firebaseArray) {
    var chatRef = fireRef.child("chat").child($scope.user.$id);
    console.log($scope.user.status);
    //Retrieving Chats
    $scope.chats = $firebaseArray(chatRef.orderByChild('time'));
    $scope.$watch('chats', function () {

            /*var audio = new Audio('audio/oh-really.mp3');
            audio.play();*/

        console.log($scope.user.$id + '- loading chat');
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
    /*$scope.newTag = '';
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
    };*/

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