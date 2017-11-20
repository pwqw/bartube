var $list = $('#list_youtube'),
    $playerContainer = $('#player_container'),
    $right = $('#right'),
    $link = $('#link'),
    $text = $('#text'),
    $item,
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
        if (items.length > 1) {
            reproducir(items[1]);
        }
        firebase.database().ref('playlist/' + items[0].datetime).remove();
        delete items[0];
    }
}


function reproducir(video, init) {
    if (init) {
        var html = videoListTemplate(video, -1, 'video_player');
        $playerContainer.html(html);

        var videoId = items.length > 0 ? items[0].id.videoId :'';
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: videoId,
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


function uploadVideos(data, init) {

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


function onYouTubeIframeAPIReady() {

    firebase.database().ref('playlist/').once('value', function (data) {
        uploadVideos( data.val(), true );

        firebase.database().ref('playlist/').on('value', function (data) {
            uploadVideos( data.val() );
        });
    });
}