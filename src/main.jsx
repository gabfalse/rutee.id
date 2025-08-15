import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme } from "./Theme/theme";
import { AuthProvider } from "./Context/AuthContext";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={getAppTheme("dark")}>
    <CssBaseline />
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
