# Reconstruire vendor/babylon-aecm.js
    npm init -y && npm i @babylonjs/core@9.29.0 @babylonjs/loaders@9.29.0 esbuild
    npx esbuild entry.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile=babylon-aecm.js
Puis copier babylon-aecm.js dans assets/www/vendor/.
