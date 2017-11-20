var $list = $('#list_youtube'),
    $playerContainer = $('#player_container'),
    $right = $('#right'),
    init = true,
    player,
    items;

var firstScriptTag = document.getElementsByTagName('script')[0],
    tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


function onPlayerReady(event) {
    event.target.playVideo();
}


function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        next();
    }
}


function reproducir(video, init) {
    if (init) {
        var html = videoListTemplate(video, -1, 'video_player');
        $playerContainer.html(html);

        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: video.id.videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
    else {
        player.loadVideoById( video.id.videoId );
    }
}


function uploadVideos(data) {

    items = [];
    for (var key in data) {
        if(typeof data[key] !== 'function') {
            data[key].datetime = key;
            items.push(data[key]);
        }
    }

    var html = '';
    for (var i=0; i<items.length; i++) {
        if ( i > 0) {
            html += videoListTemplate(items[i], i);
        }
        else if (init) {
            reproducir(items[i], init);
            init = false;
        }
    }

    $list.html(html);
    $right.css({ display:'block' });
}


function videoListTemplate(video, i, tpl) {
    if (video.id.kind == 'youtube#channel') {
        return ''
    }
    var title = video.snippet.title,
        published = video.snippet.publishedAt.split('T')[0].replace('-','/').replace('-','/'),
        author = video.snippet.channelTitle,
        thumb = video.snippet.thumbnails.high.url,
        embed = "https://www.youtube.com/embed/" + video.id.videoId,
        id = i,
        html = "";
    html = Mustache.render( Templates[tpl || 'video_list'], {
        title : title,
        published : published,
        thumb : thumb,
        author : author,
        embed : embed,
        id : id
    });
    return html;
}


function play() {
    if (player && player.playVideo) player.playVideo();
}


function pause() {
    if (player && player.pauseVideo) player.pauseVideo();
}


function next() {
    if (items.length > 1) {
        reproducir(items[1]);
    }
    if (items.length > 0) {
        var first = items.shift();
        firebase.database().ref('playlist/' + first.datetime).remove();
    }
    else {
        cleanList();
    }
}

function cleanList() {
    $list.html('');
    $playerContainer.html('<h1>Lista de reproducción vacía</h1>');
    firebase.database().ref('playlist').remove();
    init = true;
}


function onYouTubeIframeAPIReady() {
    firebase.database().ref('playlist/').on('value', function (data) {
        uploadVideos( data.val() );
    });

    $('#play').click(play);
    $('#pause').click(pause);
    $('#next').click(next);
    $('#clean').click(cleanList);
}