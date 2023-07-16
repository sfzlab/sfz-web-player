#!/bin/bash

# Usage: File
# ./tests/scripts/sfz-to-xml.sh ./tests/syntax/01-basic.sfz
#
# Usage: Folder
# ./tests/scripts/sfz-to-xml.sh ./tests/syntax


if [ ! -f tests/scripts/sfizz_preprocessor ]
then
  curl -LO https://github.com/studiorack/sfizz/releases/download/v1.1.1/sfizz-preprocessor-mac.zip
  unzip sfizz-preprocessor-mac.zip -d ./tests/scripts
  rm sfizz-preprocessor-mac.zip
fi

IFS=$'\n'

if [[ $1 == *.sfz ]]
then
  # Convert file.
  ./tests/scripts/sfizz_preprocessor "$1" --mode=xml > "${1%.*}.xml"
else
  # Convert folder.
  for file in $(find "$1" -type f -name '*.sfz')
    do ./tests/scripts/sfizz_preprocessor "$file" --mode=xml > "${file%.*}.xml"
  done
fi
