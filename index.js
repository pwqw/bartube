$(document).ready(function () {
    var database = firebase.database();

    database.ref('playlist').on('value', function (data) {
        console.log(JSON.stringify(data, null, 2))
    });

});