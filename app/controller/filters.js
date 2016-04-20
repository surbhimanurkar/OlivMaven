app.filter('removeAllSpaces', function () {
    return function(str) {
        return str.replace(/\s/g, '');
    };
});
app.filter('capitalcase', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.filter('searchKey', function(){
    return function(items, searchText){
        var arrayToReturn = [];
        angular.forEach(items, function(item){
            var index = item.$id.toLowerCase().indexOf(searchText.toLowerCase());
            if(index>=0){
                arrayToReturn.push(item);
            }
        });
        return arrayToReturn;
    }
});
app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});
