#! /bin/sh
set -e
set -x
# google-chrome --pack-extension=chrome-killfile-extension --pack-extension-key=chrome-killfile-extension.pem
# (cd firefox-killfile-extension && jpm xpi)
# mv firefox-killfile-extension/dtm-killlfile@martin.snowplow.org*.xpi .
rm -f chrome-killfile-extension.zip
zip -vr chrome-killfile-extension chrome-killfile-extension
(cd zipextra && zip -vr ../chrome-killfile-extension chrome-killfile-extension)

rm -f firefox-killfile-extension.zip
(cd chrome-killfile-extension && zip -vr ../firefox-killfile-extension * -x manifest.json)

JSONMERGE='
import json, sys
a=json.load(open(sys.argv[1]))
b=json.load(open(sys.argv[2]))
a.update(b)
print json.dumps(a, sort_keys=True, indent=2, separators=(",", ": "))
'

python -c "$JSONMERGE" chrome-killfile-extension/manifest.json firefox-manifest-extra.json > manifest.json
zip -uvm firefox-killfile-extension manifest.json
