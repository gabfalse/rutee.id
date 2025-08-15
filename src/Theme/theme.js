import { createTheme } from "@mui/material/styles";

// =====================
// ✅ PALETTE LIGHT
// =====================
const lightPalette = {
  mode: "light",
  primary: {
    main: "#2E8B8B",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FFFFFF",
    contrastText: "#2E8B8B",
  },
  background: {
    default: "#F7FDFC",
    paper: "#FFFFFF",
  },
  text: {
    primary: "#2E8B8B",
    secondary: "#4C7E7E",
  },
  divider: "#2E8B8B",
  hover: {
    main: "#247171",
  },
  border: {
    main: "#2E8B8B",
  },
  action: {
    active: "#2E8B8B",
    hover: "rgba(46, 139, 139, 0.08)",
    selected: "rgba(46, 139, 139, 0.16)",
  },
  tertiary: {
    main: "#247171",
    contrastText: "#FFFFFF",
  },
};

// =====================
// ✅ PALETTE DARK
// =====================
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#2E8B8B",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#212121ff",
    contrastText: "#E0F2F2",
  },
  background: {
    default: "#141414ff",
    paper: "#212121ff",
  },
  text: {
    primary: "#E0F2F2",
    secondary: "#C0DADA", // lebih kontras dari #B0CCCC
  },
  divider: "#2E8B8B",
  hover: {
    main: "#3FAFAF",
  },
  border: {
    main: "#2E8B8B",
  },
  action: {
    active: "#2E8B8B",
    hover: "rgba(46, 139, 139, 0.1)",
    selected: "rgba(46, 139, 139, 0.2)",
  },
  tertiary: {
    main: "#3FAFAF",
    contrastText: "#2a2a2aff",
  },
};

// =====================
// ✅ FUNGSI BUAT THEME
// =====================
export const getAppTheme = (mode = "light") => {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette: {
      ...palette,
    },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        color: palette.text.primary,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
        color: palette.text.primary,
      },
      body1: {
        fontSize: "1rem",
        color: palette.text.primary,
      },
      body2: {
        fontSize: "0.875rem",
        color: palette.text.secondary,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            "&:hover": {
              backgroundColor: palette.action.hover, // adaptif
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 12, // konsisten
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
            borderWidth: "0.3px", // <-- buat lebih tipis dari default 1px
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0 4px 12px rgba(0,0,0,0.1)"
                : "0 4px 12px rgba(34, 34, 34, 0.3)", // lebih soft
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
  });
};
