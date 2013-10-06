killfile-extension
==================

This is a Chrome extension designed to provide functionality like the usenet killfile to the
comments sections of certain blogs. With it, readers can decide that they would rather never
see comments from certain individuals, and hide those comments from view.

It is not intended as a replacement for comment moderation, but merely as a personal measure
an individual reader can take for their own peace of mind.

Installation
------------

Until I put this up on the chrome store, installation will either have to be through cloning
the git project and then loading an unpacked extension from the `extension` subdirectory, or
downloading the `killfile-extension.crx` file from this projects releases and then
installing the extension locally.

Usage
-----

Once the extension is installed, if you visit the comment page on a blog where it works you'll
see a logo in the browser bar telling you that killfile is active and a hovering your mouse over
a comment will cause two links, `[kill]` and `[hide comment]` to appear near the name of the
commenter. Clicking `[kill]` will hide that person's comments from until you click the `[unkill]`
next to their name. (As with the `[kill]` link, the `[unkill]` link is hidden until you hover
over the notification that the comment is hidden)

Feedback
--------

Please report blogs where this should work but doesn't through the normal github issue system.
(That is, blogs where the killfile logo shows up, but the comments don't have `[kill]` links
when you hover over them). Report blogs that this extension doesn't yet support, but should,
through email to <martin@snowplow.org>
