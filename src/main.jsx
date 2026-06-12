import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SteamViewer from './SteamViewer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SteamViewer />
  </StrictMode>,
)
