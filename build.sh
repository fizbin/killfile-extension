#! /bin/sh
set -e
set -x
google-chrome --pack-extension=chrome-killfile-extension --pack-extension-key=chrome-killfile-extension.pem
(cd firefox-killfile-extension && jpm xpi)
mv firefox-killfile-extension/dtm-killlfile@martin.snowplow.org*.xpi .
rm -f chrome-killfile-extension.zip
zip -vr chrome-killfile-extension chrome-killfile-extension
(cd zipextra && zip -vr ../chrome-killfile-extension chrome-killfile-extension)
