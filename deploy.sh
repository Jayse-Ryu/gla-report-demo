#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m 'GH Deployment'
git push -f git@github.com:Jayse-Ryu/gla-report-demo.git master:gh-pages

cd -
