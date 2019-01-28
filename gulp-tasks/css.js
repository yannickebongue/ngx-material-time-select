const { dest, src } = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const sassImporter = require('node-sass-tilde-importer');

const lib = 'time-select';
const dir = `projects/${lib}`;
const out = `dist/${lib}`;

sass.compiler = require('node-sass');

function css() {
  return src(`${dir}/src/theming/prebuilt/**/*.scss`)
    .pipe(sass({importer: sassImporter}).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest(`${out}/prebuilt-themes`));
}

exports.css = css;
