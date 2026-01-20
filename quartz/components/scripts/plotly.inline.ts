type PlotlyType = {
  newPlot: (
    container: HTMLElement,
    data: unknown,
    layout: unknown,
    config?: Record<string, unknown>,
  ) => Promise<void>
  purge: (container: HTMLElement) => void
}

type PlotlyWindow = Window & {
  Plotly?: PlotlyType
  renderPlotly?: (
    container: HTMLElement,
    data: unknown,
    layout: unknown,
    config?: Record<string, unknown>,
  ) => void
}

const plotlyCdnUrls = [
  "https://cdn.plot.ly/plotly-2.30.0.min.js",
  "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.30.0/plotly.min.js",
  "https://unpkg.com/plotly.js-dist-min@2.30.0/plotly.min.js",
]
const localPlotlySrc = "/static/plotly/plotly.min.js"
let plotlyLoader: Promise<PlotlyType> | null = null

const getPlotlyWindow = (): PlotlyWindow | undefined => {
  if (typeof window === "undefined") return undefined
  return window as PlotlyWindow
}

const registerCleanup = (fn: () => void) => {
  if (typeof window !== "undefined" && typeof window.addCleanup === "function") {
    window.addCleanup(fn)
  }
}

function loadPlotly(): Promise<PlotlyType> {
  if (plotlyLoader) return plotlyLoader
  plotlyLoader = new Promise((resolve, reject) => {
    const win = getPlotlyWindow()
    if (win?.Plotly) {
      resolve(win.Plotly)
      return
    }

    let index = 0
    const urls = [localPlotlySrc, ...plotlyCdnUrls]
    const tryLoad = () => {
      const url = urls[index]
      if (!url) {
        reject(new Error("Plotly failed to load"))
        return
      }

      const existingScript = document.querySelector(
        `script[data-plotly-loader="${index}"]`,
      ) as HTMLScriptElement | null

      if (existingScript) {
        const maybeWin = getPlotlyWindow()
        if (maybeWin?.Plotly) {
          resolve(maybeWin.Plotly)
          return
        }

        existingScript.addEventListener("load", () => {
          const loadedWin = getPlotlyWindow()
          if (loadedWin?.Plotly) {
            resolve(loadedWin.Plotly)
          } else {
            index += 1
            tryLoad()
          }
        })
        existingScript.addEventListener("error", () => {
          index += 1
          tryLoad()
        })
        return
      }

      const script = document.createElement("script")
      script.dataset.plotlyLoader = String(index)
      script.src = url
      script.async = true
      script.defer = true
      script.onload = () => {
        const loadedWin = getPlotlyWindow()
        if (loadedWin?.Plotly) {
          resolve(loadedWin.Plotly)
        } else {
          index += 1
          tryLoad()
        }
      }
      script.onerror = () => {
        index += 1
        tryLoad()
      }
      document.head.appendChild(script)
    }

    tryLoad()
  })
  return plotlyLoader
}

function decodePayload(raw: string | null) {
  if (!raw) return ""
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function ensureRenderPlotly(plotly: PlotlyType) {
  const win = getPlotlyWindow()
  if (!win || win.renderPlotly) return
  win.renderPlotly = (
    container: HTMLElement,
    data: unknown,
    layout: unknown,
    config?: Record<string, unknown>,
  ) => {
    const baseConfig = { displaylogo: false, responsive: true, displayModeBar: false }
    plotly
      .newPlot(container, data, layout, { ...baseConfig, ...(config ?? {}) })
      .catch((error: unknown) => {
        console.error(error)
      })
  }
}

function clearPlot(container: HTMLElement) {
  const plotTarget = container.querySelector(".plotly-target") as HTMLElement | null
  const win = getPlotlyWindow()
  if (!plotTarget || !win?.Plotly) return
  try {
    win.Plotly.purge(plotTarget)
  } catch (error) {
    console.error(error)
  }
}

function showError(container: HTMLElement, message: string) {
  container.classList.add("plotly-error")
  const output = container.querySelector(".plotly-output") as HTMLElement | null
  if (output) {
    output.textContent = message
  }
}

function renderBlock(container: HTMLElement, plotly: PlotlyType) {
  const code = decodePayload(container.getAttribute("data-plotly-code"))
  if (!code) return

  const plotTarget = container.querySelector(".plotly-target") as HTMLElement | null
  if (!plotTarget) return

  const output = container.querySelector(".plotly-output") as HTMLElement | null
  if (output) output.textContent = ""

  const sandbox = {
    container: plotTarget,
    dv: { paragraph: (text: string) => output && (output.textContent = text) },
    Plotly: plotly,
    renderPlotly: getPlotlyWindow()?.renderPlotly,
  }

  try {
    const executor = new Function("with (this) {\n" + code + "\n}")
    executor.call(sandbox)
  } catch (error) {
    console.error(error)
    showError(container, "Plotly render error. Check console output.")
  }
}

function handlePlots() {
  const containers = document.querySelectorAll(".plotly-block") as NodeListOf<HTMLElement>
  if (!containers.length) return

  loadPlotly()
    .then((plotly) => {
      ensureRenderPlotly(plotly)
      containers.forEach((container) => {
        container.classList.remove("plotly-error")
        renderBlock(container, plotly)
      })
    })
    .catch((error) => {
      console.error(error)
      containers.forEach((container) => showError(container, "Plotly failed to load."))
    })
}

document.addEventListener("nav", () => {
  const containers = document.querySelectorAll(".plotly-block") as NodeListOf<HTMLElement>
  containers.forEach((container) => clearPlot(container))
  handlePlots()
})

handlePlots()

registerCleanup(() => {
  const containers = document.querySelectorAll(".plotly-block") as NodeListOf<HTMLElement>
  containers.forEach((container) => clearPlot(container))
})
