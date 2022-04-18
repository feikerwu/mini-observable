const esbuild = require('esbuild');
const path = require('path');

const options = {
  entryPoints: [path.join(__dirname, '../src/index.ts')],
  outdir: 'dist',

  // 打包成一个文件
  bundle: true,

  target: ['es2020'],
  format: 'esm',
};

esbuild.buildSync(options);
