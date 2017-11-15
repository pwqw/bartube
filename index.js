$(document).ready(function () {
    var database = firebase.database();
    database.ref('primero/1').set({
        username: 'bar',
        email: 'tube'
    });

});