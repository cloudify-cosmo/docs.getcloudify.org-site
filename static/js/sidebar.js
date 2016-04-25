// create pages tree and render it
var sideBarTree = new Tree(pagesTree);
sideBarTree.render('.sidebar');

// bind filter box to tree filter
$('.sidebar-filter').on('keyup', function() {
  var text = $(this).val();
  sideBarTree.filter(text);
});

$('.sidebar').affix({
  offset: {
    top: -1
  }
});
