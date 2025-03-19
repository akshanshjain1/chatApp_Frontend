import { CssBaseline } from "@mui/material";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <CssBaseline />
      <div onContextMenu={(e) => e.preventDefault()}>
       
        <App />
        
      </div>
    </HelmetProvider>
  </Provider>
);
