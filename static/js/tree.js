/**
 * create a tree abstraction which can be rendered and filtered
 *
 * @param data - expects an array of nodes with one level of children (as an array)
 								 example:
  [ {
 			title: 'node1',
			children: [ {
				title: 'subnode1.1',
				url: 'http://link.to/subnode1-1'
		},
		{
			title: 'subnode1.2',
			url: 'http://link.to/subnode1-2'
		}],
		{
			title: 'node2'
			children: []
		}]
 * @returns tree object
 */
function Tree(data) {

	var self = this;
	self.data = data;
	self.rootNode = null;

	self.render = renderTree;
	self.filter = filterTree;

	return self;
}

/**
 * render the tree
 *
 * @param target html element to render tree into. can be a jQuery object/selector or a DOM node
 * @returns tree root jQuery object
 */
function renderTree(target) {

	if (this.rootNode) {
		throw new Error('tree has already been rendered');
	}

	var tree = this.data;

	var $rootNode = $('<ul class="nav nav-list tree"></ul>');
	tree.forEach(function(node) {
		var $node = $('<li class="tree-node"></li>');
		$rootNode.append($node);
		if (node.active) {
			$node.addClass('tree-expanded');
		}
		var $nodeBody = $('<div class="tree-node-body"><label><i class="fa fa-fw"></i> <span>' + node.title + '</span></label></div>');
		$node.append($nodeBody);
		$nodeBody.click(toggleNode);

		var $children = $('<ul class="nav nav-list tree"></ul>');

		$node.append($children);
		node.children.forEach(function(child) {
			$child = $('<li class="tree-node"><a href="' + child.url + '">' + child.title + '</a></li>');
			if (child.url == location.href) {
				$child.addClass('active');
			}
			$children.append($child);
		});
	});

	$(target).append($rootNode);
	this.rootNode = $rootNode[0];
	return $rootNode;
}

function toggleNode(event) {
	$(this).parents('.tree-node').toggleClass('tree-expanded');
}

/**
 * filter a rendered tree by hiding irrelevant nodes
 *
 * @param text to search for in node title
 * @returns
 */
function filterTree(text) {

	if (!this.rootNode) {
		throw new Error('tree must be rendered first');
	}

	var root = this.rootNode;
	var data = this.data;

  if (root instanceof jQuery) {
    root = root[0];
  }
  if (!(root instanceof Node)) {
    throw new Error('root must be a node or a jQuery object');
  }

  var regexp = new RegExp(text, 'i');
  var $nodesDOM = $(root).children('.tree-node');

	// reset tree view if filter is empty
  if (!text) {
    $(root).find('.tree-node').show();
		data.forEach(function(node, i) {
			$nodesDOM.eq(i).toggleClass('tree-expanded', !!node.active);
		})
    return;
  }

	// filter nodes by text
  data.forEach(function(node, i) {

    var $nodeDOM = $nodesDOM.eq(i);
    var $childrenDOM = $nodeDOM.find('.tree-node');
    var isNodeRelevant = false;
    var showAllChildren = false;

    // if 1st level matches, show all of its children
    if (regexp.test(node.title)) {
        showAllChildren = true;
    }

    node.children.forEach(function(child, j) {

      var childDOM = $childrenDOM[j];
      if (showAllChildren || regexp.test(child.title)) {
        isNodeRelevant = true;
        $(childDOM).show();
      }
      else {
        $(childDOM).hide();
      }
    });
    if (isNodeRelevant) {
      $nodeDOM.show().addClass('tree-expanded');
    }
    else {
      $nodeDOM.hide();
    }

  });

}
