var player, database;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


function onPlayerReady(event) {
    event.target.playVideo();
}


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


function onYouTubeIframeAPIReady() {

    firebase.database().ref('playlist/').once('value', function (data) {
        makeDatabase( data.val() );

        var videoId = database.length > 0 ? database[0].id.videoId :'';
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