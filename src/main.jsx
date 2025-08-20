import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getAppTheme } from "./Theme/theme";
import { AuthProvider } from "./Context/AuthContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

function Root() {
  // state untuk mode, default dark
  const [mode, setMode] = useState("dark");

  return (
    <ThemeProvider theme={getAppTheme(mode)}>
      <CssBaseline />
      <AuthProvider>
        <App mode={mode} setMode={setMode} />
      </AuthProvider>
    </ThemeProvider>
  );
}

root.render(<Root />);
