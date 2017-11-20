// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, database;


function onPlayerReady(event) {
    event.target.playVideo();
}


var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {

        if (database.length > 1) {
            reproducir(database[1]);
        }

        firebase.database().ref('playlist/' + database[0].datetime).remove();
        delete database[0];
    }
}

function reproducir(video) {
    player.loadVideoById( video.id.videoId );

}

function stopVideo() {
    player.stopVideo();
}

function makeDatabase(data) {
    database = [];
    for (var key in data) {
        if(typeof data[key] !== 'function') {
            data[key].datetime = key;
            database.push(data[key]);
        }
    }
    return database;
}


// 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
function onYouTubeIframeAPIReady() {

    firebase.database().ref('playlist/').once('value', function (data) {

        makeDatabase( data.val() );

        var videoId;

        if (database.length > 0) {
            videoId = database[0].id.videoId;
        }
        else {
            videoId = '';
        }

        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

        firebase.database().ref('playlist/').on('value', function (data) {

            makeDatabase( data.val() );

        });
    });


}