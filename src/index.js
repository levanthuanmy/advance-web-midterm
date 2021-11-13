import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import ReactDOM from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
