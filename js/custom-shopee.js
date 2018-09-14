function zoom_in_thumbnail_32x32() {
  $('img[src*="32x32"]').popover({
    container: 'body',
    html: true,
    trigger: 'hover',
    placement: 'bottom',
    content: function () {
      var img = $(this).attr('src')
      img = img.replace("32x32", "200x200")
      console.log(img);
      return '<img src="' + img + '" />';

    }
  });
}