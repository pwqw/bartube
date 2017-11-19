
var url = 'https://www.googleapis.com/youtube/v3/search',
    $youtube = $('#youtube'),
    $query = $('#search_query'),
    $search = $('#search_button'),
    $result = $('#result_youtube'),
    $right = $('#right'),
    $link = $('#link'),
    $text = $('#text'),
    $item,
    textSearch,
    items;

function sendSocialEvent (e) {
    e.preventDefault();
    window.location.href = 'http://youtube.com';
    // body...
}

$link.on('click', sendSocialEvent);

function hideVideoView() {
    $(this).on('click', showVideoView).parents('.item').first().removeClass('active');
}

function showVideoView() {
    $(this).on('click', hideVideoView).parents('.item').first().addClass('active');
}

function encolarVideoView() {
    var video = items[$(this).data('id')];
    firebase.database().ref('playlist/' + video.id.videoId ).set({
        video: video,
        datetime: Date.now()
    });
    alert("enviando: " + video.snippet.title);
}

function videoTemplate(video, i) {
    if (video.id.kind == 'youtube#channel') {
        return ''
    }

    var title = video.snippet.title,
        published = video.snippet.publishedAt.split('T')[0].replace('-','/').replace('-','/'),
        author = video.snippet.channelTitle,
        category = "Tech",
        thumb = video.snippet.thumbnails.high.url,
        embed = "https://www.youtube.com/embed/" + video.id.videoId,
        views = "10K",
        id = i,
        html = "";

    html = Mustache.render(Templates.video, {
        thumb : thumb,
        title : title,
        author : author,
        category : category,
        published : published,
        embed : embed,
        views : views,
        id : id
    });

    return html;
}

function callback(res) {
    items = res.items;
    var html = '';
    for (var i=1; i<items.length; i++) {
        html += videoTemplate(items[i], i);
    }

    $result.html(html);

    // $text.html( textSearch + ', Do you want to do the search on YouTube?');

    $link.attr('href','http://www.youtube.com/results?search_query=' + textSearch );

    // if ($(window).width() > 768) {
    //     $('article:first-child').off('click');
    // }

    $right.css({ display:'block' });

    $('a').on('click', function(e){
        e.preventDefault();
    });

    $('.show_video').on('click', showVideoView);
    $('.encolar_video').on('click', encolarVideoView);

    $query.val('');
}

function submit() {
    $query.val($query.val() || 'Planeta Cabezon Rosario');
    textSearch = $query.val();
    // Envento de Segment
    // ga.track('Search a video', {
    //     query: textSearch
    // });
    $.ajax({
        data : {
            q: $query.val(),
            key: 'AIzaSyC9X_RJzeeCplmrB6mB6qgZuLy_MLoyjEA',
            part: 'snippet',
            maxResults: 25
        },
        url: url
    }).done( callback );

    $result.html('<img class="loading_image" src="img/loading.gif" /><p class="loading_text">Loading ...</p>');
    $right.css({ display:'none' });
}


$search.on( 'click', submit() );

$query.keyup(function (key) {
    if (key.keyCode == 13) {
        submit();
    }
});


$('#activity a').on('click', function(){
    $query.val($(this).text());
    submit();
});

submit();
