
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner';
import { SocketProvider } from './context/SockectContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <SocketProvider>
    <App />
    <Toaster closeButton />
  
  </SocketProvider>
  // </React.StrictMode>,
)
