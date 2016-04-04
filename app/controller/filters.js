app.filter('removeAllSpaces', function () {
    return function(str) {
        return str.replace(/\s/g, '');
    };
});