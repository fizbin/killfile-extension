// Handle disqus iframed comments
define && define(
  "disqus", ["./scenarios", "./clientUtil"], function (scenarios, clientUtil) {
    "use strict";
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
                    var commentNode = scen.handleComment(c);
                    if (commentNode) {
                      scen.checkComment(commentNode);
                    }
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
      clientUtil.sendMessage({type: "showPageAction"});
    }

    function postScenariosLoad() {
      console.log('Scenarios loaded');
      scen = {
        commenttopxpath: '//div[@data-role="post-content"]',
        commentmidxpath: './/div[@data-role="post-content"]',
        aHrefAttribute: 'data-user',
        sigbit: './/header//*[contains(concat(" ", @class, " "), " author ")]',
        mangleAppend: './/header'
          + '//*[contains(concat(" ", @class, " "), " post-meta ")]',
        __proto__:scenarios.killfileScenario.basicScenario()
      };
      function cb(mr, mo) {
        var pl = document.getElementById('post-list');
        if (pl) {
          console.log('found post-list');
          mo.disconnect();
          // scenarios.enableProgressLog();
          postListAttach();
        }
      };
      var mo1 = new MutationObserver(cb);
      mo1.observe(document.body, { childList: true, subtree: true });
      cb([], mo1);
      console.log('attached post-list finder');
    }

    postScenariosLoad();
  });

/// Local Variables: ///
/// mode: Javascript ///
/// tab-width: 4 ///
/// indent-tabs-mode: nil ///
/// js-indent-level: 2 ///
/// End: ///
