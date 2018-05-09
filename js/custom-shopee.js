function zoom_in_thumbnail_32x32() {
  $('img[src*="32x32"]').popover({
    html: true,
    trigger: 'hover',
    //placement: 'bottom',
    content: function(){return '<img src="'+$(this).attr('src').replace("32x32", "400x400") + '" />';}
    });
}