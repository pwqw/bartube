var Templates = {};

Templates.video = [
    '<article class="item">',
    '<figure class="image_item"> <img src="{{ thumb }}" /> </figure>',
    '<div class="desktop">',
    '<h2 class="title_item"><a href="#">{{ title }}</a></h2>',
    '<p class="author_item"> Por <a href="#">{{ author }}</a></p>',
    '<p class="data_item">',
    '<a class="tag_item show_video" href="#">Ver video</a>',
    '<a class="tag_item encolar_video" data-id="{{ id }}" href="#">Agregar a la lista del bar!</a>',
    '<span class="published_item">{{ published }}</span>',
    '</p>',
    '</div>',
    '<div class="embed_item">',
    '<iframe src="{{ embed }}" frameborder="0" allowfullscreen></iframe>',
    '</div>',
    '</article>'
].join("\n");

Templates.video_list = [
    '<article class="item">',
    '<figure class="image_item"> <img src="{{ thumb }}" /> </figure>',
    '<div class="desktop">',
    '<h2 class="title_item"><a href="#">{{ title }}</a></h2>',
    '<p class="author_item"> Por <a href="#">{{ author }}</a></p>',
    '<p class="data_item">',
    '<span class="published_item">{{ published }}</span>',
    '</p>',
    '</div>',
    '</article>'
].join("\n");