import {Plugin} from "@esbuild";

export const transformScriptTags : Plugin = {
  name: 'transform-script-tags',
  setup(build) {
    build.onLoad({filter: /\.html$/}, (args) => {
      const htmlIn = Deno.readTextFileSync(args.path)
      
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
}
