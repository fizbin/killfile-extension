killfile-extension
==================

This is a browser extension (for Chrome & Firefox) designed to provide
functionality like the usenet killfile to the comments sections of
certain blogs. With it, readers can decide that they would rather never
see comments from certain individuals, and hide those comments from view.

It is not intended as a replacement for comment moderation, but merely
as a personal measure an individual reader can take for their own peace
of mind.

This extension is a revival of code from an old greasemonkey script of
mine, <http://userscripts.org/scripts/show/4107>. As such, some of the
code may have suffered from bitrot in the meantime and needs retesting
on all supported blogs.

Installation
------------

This extension can now be installed from the
[Chrome store](https://chrome.google.com/webstore/detail/blog-comment-killfile/kpoilnkelonbaapoapibddjaojohnpjf)
or [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/blog-killfile/)

Alternatively, clone the source and run `build.sh`.

Usage
-----

Once the extension is installed, if you visit the comment page on a
blog where it works you'll see a logo in the browser bar telling you
that killfile is active and a hovering your mouse over a comment will
cause two links, `[kill]` and `[hide comment]` to appear near the name
of the commenter. Clicking `[kill]` will hide that person's comments
from until you click the `[unkill]` next to their name. (As with the
`[kill]` link, the `[unkill]` link is hidden until you hover over the
notification that the comment is hidden)

Feedback
--------

Please report blogs where this should work but doesn't through the
normal github issue system.  (That is, blogs where the killfile logo
shows up, but the comments don't have `[kill]` links when you hover over
them). Report blogs that this extension doesn't yet support, but should,
through email to <martin@snowplow.org>
