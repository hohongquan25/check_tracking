import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function renderApp() {
  const container = document.getElementById('track-order')
  if (container) {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  } else {
    console.error("❌ Không tìm thấy #track-order trong DOM")
  }
}

// Đảm bảo chỉ chạy khi DOM đã load xong
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderApp)
} else {
  renderApp()
}
