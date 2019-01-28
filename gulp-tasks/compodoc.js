const { src } = require('gulp');
const compodoc = require('@compodoc/gulp-compodoc');

const lib = 'time-select';
const dir = `projects/${lib}`;
const options = {
  output: 'dist/docs',
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
    compodoc(options)
  );
};

function build() {
  return generate(options);
}

function serve() {
  return generate(Object.assign(options, {serve: true}));
}

exports.build = build;
exports.serve = serve;
