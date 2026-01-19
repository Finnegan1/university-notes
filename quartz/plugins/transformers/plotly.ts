import { Root, Code, Html, Parent } from "mdast"
import { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"
import { JSResource } from "../../util/resources"
// @ts-ignore
import plotlyScript from "../../components/scripts/plotly.inline"

interface Options {
  language: string
  requireRenderPlotly: boolean
}

const defaultOptions: Options = {
  language: "dataviewjs",
  requireRenderPlotly: true,
}

const plotlyRenderToken = "renderPlotly"
const plotlyJsToken = "Plotly"

export const Plotly: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "Plotly",
    markdownPlugins() {
      const plugins: PluggableList = []
      plugins.push(() => {
        return (tree: Root) => {
          visit(tree, "code", (node: Code, index, parent: Parent | undefined) => {
            if (!parent || typeof index !== "number") return
            if (node.lang !== opts.language) return
            if (
              opts.requireRenderPlotly &&
              !node.value.includes(plotlyRenderToken) &&
              !node.value.includes(plotlyJsToken)
            ) {
              return
            }

            const encoded = encodeURIComponent(node.value)
            const html = `<div class="plotly-block" data-plotly-code="${encoded}"><div class="plotly-target"></div><div class="plotly-output" aria-live="polite"></div></div>`
            parent.children[index] = { type: "html", value: html } as Html
          })
        }
      })
      return plugins
    },
    externalResources() {
      const js: JSResource[] = [
        {
          script: plotlyScript,
          loadTime: "afterDOMReady",
          contentType: "inline",
        },
      ]
      return { js }
    },
  }
}
