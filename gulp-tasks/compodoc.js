const { series, src } = require('gulp');
const del = require('del');
const compodoc = require('@compodoc/gulp-compodoc');

const lib = 'time-select';
const dir = `projects/${lib}`;
const out = 'dist/docs';

const settings = {
  output: out,
  tsconfig: `${dir}/tsconfig.lib.json`,
  theme: 'material',
  disableSourceCode: false,
  disableDomTree: true,
  disableGraph: true,
  disableCoverage: true,
  disablePrivate: true,
  disableInternal: true,
  disableLifeCycleHooks: false
};

const generate = function(options) {
  return src(`${dir}/src/lib/**/*.ts`).pipe(
    compodoc(Object.assign({}, settings, options || {}))
  );
};

function clean() {
  return del(`${out}/**`);
}

function build() {
  return generate();
}

function serve() {
  return generate({serve: true});
}

exports.build = series(clean, build);
exports.serve = series(clean, serve);
