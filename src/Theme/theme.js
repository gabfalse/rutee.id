import { createTheme } from "@mui/material/styles";

// =====================
// PALETTE LIGHT
// =====================
const lightPalette = {
  mode: "light",
  primary: { main: "#3A9D9D", contrastText: "#FFFFFF" },
  secondary: { main: "#FFFFFF", contrastText: "#2E8B8B" }, // biar bubble lawan jelas
  background: { default: "#F0FBFB", paper: "#FFFFFF" },
  text: { primary: "#2E8B8B", secondary: "#4C7E7E" },
  divider: "#B2DFDB",
  action: {
    active: "#3A9D9D",
    hover: "rgba(58, 157, 157, 0.08)",
    selected: "rgba(58, 157, 157, 0.16)",
  },
  tertiary: { main: "#247171", contrastText: "#FFFFFF" },

  // ✅ tambahan khusus chat
  chat: {
    ownBg: "#3A9D9D",
    ownText: "#FFFFFF",
    otherBg: "#E0F2F2",
    otherText: "#2E8B8B",
  },
};

// =====================
// PALETTE DARK
// =====================
const darkPalette = {
  mode: "dark",
  primary: { main: "#3FAFAF", contrastText: "#FFFFFF" },
  secondary: { main: "#1E1E1E", contrastText: "#E0F2F2" },
  background: { default: "#121212", paper: "#1E1E1E" },
  text: { primary: "#E0F2F2", secondary: "#A0C4C4" },
  divider: "#3FAFAF",
  action: {
    active: "#3FAFAF",
    hover: "rgba(63, 175, 175, 0.12)",
    selected: "rgba(63, 175, 175, 0.24)",
  },
  tertiary: { main: "#3FAFAF", contrastText: "#FFFFFF" },

  // ✅ tambahan khusus chat
  chat: {
    ownBg: "#3FAFAF",
    ownText: "#FFFFFF",
    otherBg: "#2C2C2C",
    otherText: "#E0F2F2",
  },
};

// =====================
// FUNGSI BUAT THEME
// =====================
export const getAppTheme = (mode = "light") => {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette: { ...palette },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h1: { fontSize: "2.5rem", fontWeight: 700, color: palette.text.primary },
      h2: { fontSize: "2rem", fontWeight: 600, color: palette.text.primary },
      body1: { fontSize: "1rem", color: palette.text.primary },
      body2: { fontSize: "0.875rem", color: palette.text.secondary },
      button: { textTransform: "none", fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            "&:hover": { backgroundColor: palette.action.hover },
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none", borderRadius: 12 } },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: palette.divider, borderWidth: "0.3px" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0 4px 12px rgba(0,0,0,0.08)"
                : "0 4px 12px rgba(0,0,0,0.5)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: palette.primary.main,
            color: palette.primary.contrastText,
            boxShadow: "none",
          },
        },
      },
    },

    // =====================
    // ✅ CUSTOM STYLE UNTUK RESUME
    // =====================
    resumeStyles: {
      container: {
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        color: mode === "dark" ? "#E0F2F2" : "#000",
        lineHeight: 1.3,
        backgroundColor: mode === "dark" ? "#1E1E1E" : "#fff",
        padding: "16px",
        maxWidth: "595px",
        margin: "0 auto",
      },
      header: { textAlign: "center", marginBottom: "8px" },
      h1: { fontSize: "36px", fontWeight: "bold", margin: 0 },
      h2: { fontSize: "16px", fontWeight: "bold", marginBottom: "4px" },
      p: { fontSize: "12px", margin: "2px 0" },
      ul: { paddingLeft: "18px", margin: 0 },
      li: { fontSize: "11px", marginBottom: "2px" },
      divider: {
        borderTop: "0.3px solid",
        margin: "8px 0",
        borderColor: palette.divider,
      },
      link: {
        textDecoration: "none",
        fontSize: "11px",
        color: palette.primary.main,
      },
    },
  });
};
