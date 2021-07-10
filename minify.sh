# Minify JavaScript files
find . -name "*.js" ! -name "*.min.*" -exec sh -c 'uglifyjs -c -m --mangle-props -o "${0%.js}.min.js" "$0"' {} \;

# Minify CSS files
find . -name "*.css" ! -name "*.min.*" -exec sh -c 'uglifycss --output "${0%.css}.min.css" "$0"' {} \;
