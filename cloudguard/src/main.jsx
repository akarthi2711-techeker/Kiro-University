import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

// HashRouter is used instead of BrowserRouter so that deep links and page
// refreshes work correctly on GitHub Pages (a static host with no fallback
// routing).  URLs become  /#/checklist  instead of  /checklist — the hash
// fragment is never sent to the server, so GitHub Pages always serves
// index.html and React Router handles the rest client-side.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
