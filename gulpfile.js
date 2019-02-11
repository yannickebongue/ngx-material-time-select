const { dest, series, src } = require('gulp');
const run = require('gulp-run');

const { css } = require('./gulp-tasks/css');
const { theming } = require('./gulp-tasks/theming');
const { version } = require('./gulp-tasks/version');
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

function pack() {
  return run(`npm pack`, {cwd: out, verbosity: 3}).exec();
}

function publish() {
  return run(`npm publish`, {cwd: out, verbosity: 3}).exec();
}

const buildLib = series(build, theming, css, copyFiles, version);

exports['build:lib'] = buildLib;
exports['build:docs'] = compodoc.build;
exports['serve:docs'] = compodoc.serve;
exports['package'] = series(buildLib, pack);
exports['publish'] = series(buildLib, publish);
exports['default'] = buildLib;
