const { dest, src } = require('gulp');
const bump = require('gulp-bump');
const fs = require('fs');

const lib = 'time-select';
const out = `dist/${lib}`;

function version() {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  return src(`${out}/package.json`)
    .pipe(bump({version: pkg.version}))
    .pipe(dest(out));
}

exports['version'] = version;
