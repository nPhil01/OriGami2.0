#!/bin/bash

set -euo pipefail
IFS=$'\n\t'

# db data safe url
api_adr=${API_URL:-https://giv-origami.uni-muenster.de/origamidb}

# our db data safe
#api_adr=${API_URL:-file:///C:/Users/t3key/documents/GitHub/OriGami2.0/www/test_data}


sed -i -e "s|ORIGAMI_API_URL|$api_adr|g" /usr/src/app/www/js/services.js

exec /bin/true
