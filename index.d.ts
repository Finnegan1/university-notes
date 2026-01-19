declare module "*.scss" {
  const content: string
  export = content
}

// dom custom event
interface CustomEventMap {
  prenav: CustomEvent<{}>
  nav: CustomEvent<{ url: FullSlug }>
  themechange: CustomEvent<{ theme: "light" | "dark" }>
  readermodechange: CustomEvent<{ mode: "on" | "off" }>
}

type ContentIndex = Record<FullSlug, ContentDetails>
declare const fetchData: Promise<ContentIndex>

declare global {
  interface Window {
    Plotly?: {
      newPlot: (
        container: HTMLElement,
        data: unknown,
        layout: unknown,
        config?: Record<string, unknown>,
      ) => Promise<void>
      purge: (container: HTMLElement) => void
    }
    renderPlotly?: (
      container: HTMLElement,
      data: unknown,
      layout: unknown,
      config?: Record<string, unknown>,
    ) => void
  }
}

export {}
