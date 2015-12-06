// create pages tree and render it
var t = new Tree(pagesTree);
t.render('.sidebar');

// bind filter box to tree filter
$('.sidebar-filter').on('keyup', function() {
  var text = $(this).val();
  t.filter(text);
});

$('.sidebar').affix({
  offset: {
    top: -1
  }
});
