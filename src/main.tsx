import "@fontsource/im-fell-english/400.css"
import "@fontsource/im-fell-english/400-italic.css"
import "@fontsource/unifrakturcook/700.css"
import "@fontsource-variable/hanken-grotesk/index.css"
import "./index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
