import * as esbuild from 'esbuild-wasm';


export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //Handle index.js
      build.onResolve({filter: /(^index\.js$)/}, () => {
        return {path: 'index.js', namespace: 'a'}
      })

      //Handle relative path
      build.onResolve({filter: /^\.+\//}, async (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
        }
      })

      //Handle main file
      build.onResolve({filter: /.*/}, async (args: any) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a'
        };
      });
    },
  };
};