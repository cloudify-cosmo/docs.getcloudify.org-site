var customResultRenderFunction = function(ctx, data) {
  var withSections = [],
  noSections = [];
  $.each(data, function(docType, results) {
    $.each(results, function(idx, result) {
      if (result.sections && result.sections.length > 15) {
        withSections.push(result);
      } else {
        noSections.push(result);
      }
    });
  });
  var withSectionsList = $('<ul class="with_sections"></ul>'),
  noSectionsList = $('<ul class="no_sections"></ul>');
  $.each(withSections, function(idx, item) {
    ctx.registerResult($('<li class="result"><p>' + item['title'] + '</p></li>').appendTo(withSectionsList), item);
  });
  $.each(noSections, function(idx, item) {
    ctx.registerResult($('<li class="result"><p>' + item['title'] + '</p></li>').appendTo(noSectionsList), item);
  });
  if (withSections.length > 0) {
    withSectionsList.appendTo(ctx.list);
  }
  if (noSections.length > 0) {
    noSectionsList.appendTo(ctx.list);
  }
};

var customRenderFunction = function(document_type, item) {
  var version = location.pathname.split("/")[1];
  if (item['url'].search('/' + version + '/') < 0) {
    return;
  }
  return '<div class="st-result"><a href="' + item['url'] + '" class="st-search-result-link">' + item['title'] + '</a></div>';
};

$('.search-input').swiftypeSearch({
  resultContainingElement: '.search-results',
  renderFunction: customRenderFunction,
  resultRenderFunction: customResultRenderFunction,
  resultListSelector: '.result',
  perPage: 100,
  engineKey: '4Bepa_eR9C3qKoub7af9',
});

// show search results if user is in search box
$('.search-input').focus(function(e) {
  $('.search-results').show();
});

// hide search results when user points outside search box and results
$('.search-input').blur(function(e) {
  if (!$(e.relatedTarget).parents('.search-results').length)
    $('.search-results').hide();
});
