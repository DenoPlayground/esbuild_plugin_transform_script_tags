import {Plugin} from "@esbuild";

interface Options {
  /**
   * The reader to use to read the contents of a file. Defaults to `Deno.readTextFileSync`.
   */
  readTextFileSync: (path : string | URL) => string;
}

/**
 * Transforms the `src` attribute of script tags in HTML files to point to JavaScript files instead of TypeScript files.
 * 
 * @param options Options for the plugin
 * @returns A plugin object that can be used with esbuild.
 */
const transformScriptTags : (options? : Options) => Plugin = (options = {readTextFileSync: Deno.readTextFileSync}) => ({
  name: 'transform-script-tags',
  setup(build) {
    build.onLoad({filter: /\.html$/}, (args) => {
      const htmlIn = options.readTextFileSync(args.path)
      
      const htmlOut = htmlIn.replace(
        /(?<=<script.*src=")(.*)(?=">)/gm,
        (_, src : string) => {
          return src.replace(/\.ts$/, '.js')
        }
      )

      return {
        contents: htmlOut,
        loader: 'copy'
      }
    })
  }
})

export default transformScriptTags;
