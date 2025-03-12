import { CssBaseline } from "@mui/material";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App.jsx";
import store from "./store.js";
import { Auth0Provider } from "@auth0/auth0-react";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <CssBaseline />
      <div onContextMenu={(e) => e.preventDefault()}>
        <Auth0Provider domain="dev-7ua3ni4at8802xw2.us.auth0.com" clientId="Wi3vV5veoCSnAabqGSHiFpPxtMsdMZxI"  authorizationParams={{
    redirect_uri: window.location.origin,
    connection: "google-oauth2", // Directly use Google login
  }}>
        <App />
        </Auth0Provider>
      </div>
    </HelmetProvider>
  </Provider>
);
