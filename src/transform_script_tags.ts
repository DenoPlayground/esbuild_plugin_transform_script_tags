import {Plugin} from "@esbuild";

const transformScriptTags : (
  options? : {readTextFileSync: (path: string | URL) => string}
) => Plugin = (options = {readTextFileSync: Deno.readTextFileSync}) => ({
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
