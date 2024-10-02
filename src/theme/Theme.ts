// src/theme/theme.js
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { colors, styled, SwitchProps } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#E6DCFD",
      contrastText: "#1a1a1a",
    },
    warning: {
      main: "#ef4444",
    },
    // secondary: {
    //   main: '#03dac6',
    // },
    background: {
      default: "#1a1a1a",
      paper: "#242424",
    },
  },
  typography: {
    fontFamily: "inherit",
    // Optionally, define variant-specific styles here if needed globally
  },
  components: {
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: "inherit",
          color: theme.palette.primary.main,
          fontSize: "14px",
          "@media (min-width: 640px)": {
            fontSize: "16px",
          },
          "@media (min-width: 768px)": {
            fontSize: "18px",
          },
          "@media (min-width: 1024px)": {
            fontSize: "20px",
          },
          borderRadius: "8px",
          padding: "12px 16px",
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: "4px",
          borderRadius: "4px",
          backgroundColor: "#E6DCFD", // Ensure indicator uses primary color
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme, expanded }) => ({
          border: `solid ${theme.palette.primary.main} ${
            expanded ? "4px" : "1px"
          }`,
          backgroundColor: theme.palette.background.default,
          borderRadius: "0.75rem",
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&::before": {
            display: "none",
          },
        }),
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          borderRadius: "0.75rem",
          "&.Mui-expanded": {
            borderBottomLeftRadius: "0",
            borderBottomRightRadius: "0",
          },
          // Target Typography within AccordionSummary
          "& .MuiTypography-root": {
            color: theme.palette.primary.main,
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            "@media (min-width:600px)": {
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            },
            "@media (min-width:960px)": {
              fontSize: "1.5rem",
              lineHeight: "2rem",
            },
          },
        }),
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: ({ theme }) => ({
          //   padding: theme.spacing(2),
          backgroundColor: theme.palette.background.default, // Ensure consistency
          borderRadius: "0.75rem",
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
        // Define h1 and body1 if needed globally
        h1: {
          // You can define global h1 styles here if desired
        },
        body1: {
          // You can define global body1 styles here if desired
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          "& .MuiTypography-root": {
            // This targets the label Typography
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            "@media (min-width:600px)": {
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            },
            "@media (min-width:960px)": {
              fontSize: "1.5rem",
              lineHeight: "2rem",
            },
          },
        }),
        label: {
          // Additional label-specific styles if needed
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          borderRadius: "0.75rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
          "& .MuiSelect-icon": {
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.primary.main,
          "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
          },
          "&.Mui-selected": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
            },
          },
        }),
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          // If you want to style the input elements globally
          color: theme.palette.primary.main,
          "& input": {
            // Styles for the input element
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: ({ theme }) => ({
          switchBase: {
            "&.Mui-checked": {
              color: theme.palette.primary.main, // Thumb color when checked
            },
          },
          "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: theme.palette.primary.main,
          },
        }),
      },
    },
  },
});





export default Theme;
