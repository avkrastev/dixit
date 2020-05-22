#!/bin/bash

cd "$(dirname ${BASH_SOURCE[0]})/src/assets/images/cards"

for jpg in *.jpg
do
  mv "$jpg" "${jpg%.jpg}.png"
done

a=1
for png in *.png
do
  new=$(printf "%d.png" "$a")
  mv -i -- "$png" "$new"
  let a=a+1
done


