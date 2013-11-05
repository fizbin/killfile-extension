#! /bin/sh
set -e
set -x
chromium-browser --pack-extension=chrome-killfile-extension --pack-extension-key=chrome-killfile-extension.pem
(cd firefox-killfile-extension && cfx xpi)
mv firefox-killfile-extension/killfile.xpi .
rm -f chrome-killfile-extension.zip
zip -vr chrome-killfile-extension chrome-killfile-extension
cd zipextra
zip -vr ../chrome-killfile-extension chrome-killfile-extension
