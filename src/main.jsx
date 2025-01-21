import { CssBaseline } from '@mui/material'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './store.js'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
    <HelmetProvider>
    <GoogleOAuthProvider clientId='354495429651-ksit72upkb2ena1b6jo5bjsgm0ib4q1q.apps.googleusercontent.com'>    
        <CssBaseline/>
    <div onContextMenu={(e)=>e.preventDefault()}>
    <App />
    </div>
    </GoogleOAuthProvider>

    </HelmetProvider>
    </Provider>
  
)
