function renderToc(source, target, options) {

  options = options || {
    offset: 0
  };

  $toc = $('<div class="toc"></div>');

  var previousLevel = 0;
  var $currentNode = $toc;

  $(source).find('h1,h2').each(function(i, heading) {
    var currentLevel = Number(heading.tagName.replace(/\D+/g, ''));
    var refId = heading.id;
    var text = $(heading).text();

    var $node = createTocEntry(text, refId);
    if (currentLevel > previousLevel) {
      var $newList = $('<ul class="nav toc-level toc-level-' + currentLevel + '"></ul>');
      $currentNode.append($newList);
      $newList.append($node);
    }
    else if (currentLevel == previousLevel) {
      $currentNode.after($node);

    }
    else {
      for (var i = 0; i <= 2 * (previousLevel - currentLevel); i++)
      $currentNode = $currentNode.parent();
      $currentNode.append($node);
    }

    $currentNode = $node;
    previousLevel = currentLevel;

  });

  $(target).append($toc);

  function createTocEntry(text, refId) {

    var $entry = $('<li class="toc-entry"><a href="#' + refId + '">' + text + '</a></li>');
    $entry.find('a').click(jumpToLink);
    return $entry;
  }

  function jumpToLink(event) {
    event.preventDefault();
    var targetId = $(this).attr('href');
    location.hash = targetId;
    $(targetId)[0].scrollIntoView();
    scrollBy(0, -options.offset);
  }
}

// render TOC
renderToc($('.content'), $('.toc-container'), { offset: 60 });

// affix toc
$('.toc-container').affix({
  offset: {
    top: -1
  }
});


// init scrollspy
$('body').scrollspy({
  target: '.toc',
  offset: $('body h1:first').offset().top
});
