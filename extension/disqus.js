// Handle disqus iframed comments
(function (){
  var scen;
  function postListAttach() {
    var mo = new MutationObserver(
      function(mrList) {
	mrList.forEach(function(mr){
	  Array.prototype.forEach.call(
	    mr.addedNodes,
	    function(node) {
	      scen.foreachCommentUnder(
		node, scen.commentmidxpath,
		function(c) {
		  scen.handleComment(c);
		});
	    }
	  );
	});
      }
    );
    var pl = document.getElementById('post-list');
    Array.prototype.forEach.call(
      pl.childNodes,
      function(node) {
	scen.foreachCommentUnder(
	  node, scen.commentmidxpath,
	  function(c) {
	    scen.handleComment(c);
	  });
      }
    );
    mo.observe(pl, {childList: true});
    chrome.runtime.sendMessage({type: "showPageAction"});
  }

  function postScenariosLoad() {
    console.log('Scenarios loaded');
    scen = {
      commenttopxpath: '//div[@data-role="post-content"]',
      commentmidxpath: './/div[@data-role="post-content"]',
      aHrefAttribute: 'data-user',
      sigbit: './/header/*[contains(concat(" ", @class, " "), " author ")]',
      mangleAppend: './/header'
	+ '/*[contains(concat(" ", @class, " "), " post-meta ")]',
      __proto__:dtm_killfile_killfileScenario.basicScenario()
    };
    function cb(mr, mo) {
      var pl = document.getElementById('post-list');
      if (pl) {
	console.log('found post-list');
	mo.disconnect();
	postListAttach();
      }
    };
    var mo1 = new MutationObserver(cb);
    mo1.observe(document.firstElementChild,
		{ childList: true, subtree: true });
    cb([], mo1);
    console.log('attached post-list finder');
  }

  chrome.runtime.sendMessage(
    {type: "loadScenarios", allFrames: true},
    postScenariosLoad);
  console.log('asked for scenarios');
})();
