const { dest, series, src } = require('gulp');
const run = require('gulp-run');

const css = require('./gulp-tasks/css').css;
const theming = require('./gulp-tasks/theming').theming;
const compodoc = require('./gulp-tasks/compodoc');

const lib = 'time-select';
const out = `dist/${lib}`;

function build() {
  return run(`ng build ${lib}`, {verbosity: 3}).exec();
}

function copyFiles() {
  return src(['LICENSE', 'README.md'])
    .pipe(dest(out));
}

exports['build'] = build;
exports['build:docs'] = compodoc.build;
exports['serve:docs'] = compodoc.serve;
exports['default'] = series(build, theming, css, copyFiles);
