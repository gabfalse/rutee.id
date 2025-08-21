import { Box } from "@mui/material";
import React from "react";
import AppRouter from "./Router/AppRouter";

function App({ mode, setMode }) {
  return (
    <Box>
      {/* teruskan juga ke AppRouter biar bisa dipakai di Navbar/NavigationButton */}
      <AppRouter mode={mode} setMode={setMode} />
    </Box>
  );
}

export default App;
