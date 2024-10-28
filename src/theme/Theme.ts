import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
  palette: {
    primary: {
      main: "#E6DCFD",
      contrastText: "#1a1a1a",
    },
    secondary: {
      main: "#E6DCFD99",
    },
    warning: {
      main: "#ef4444",
    },
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
        root: ({ theme, ownerState }) => ({
          border: `solid ${theme.palette.primary.main} ${
            ownerState.expanded ? "3px" : "1px"
          }`,
          backgroundColor: theme.palette.background.default,
          borderRadius: "0.75rem",
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
          fontSize: "1.75rem",
          //   lineHeight: 1.2,
          "@media (min-width:640px)": {
            fontSize: "2rem",
            // lineHeight: 1.4,
          },
          "@media (min-width:768px)": {
            fontSize: "2.5rem",
            // lineHeight: 1.4,
          },
          "@media (min-width:1024px)": {
            fontSize: "3rem",
            // lineHeight: "2rem",
          },
        },
        // h2: {
        //   fontSize: "1.5rem",
        //   //   lineHeight: 1.2,
        //   "@media (min-width:600px)": {
        //     fontSize: "2rem",
        //     // lineHeight: 1.4,
        //   },
        //   "@media (min-width:960px)": {
        //     fontSize: "2.5rem",
        //     // lineHeight: "2rem",
        //   },
        // },
        h4: {
          fontSize: "1.25rem",
          //   lineHeight: 1.2,
          "@media (min-width:640px)": {
            fontSize: "1.5rem",
            // lineHeight: 1.4,
          },
          "@media (min-width:768px)": {
            fontSize: "1.75rem",
            // lineHeight: 1.4,
          },
          "@media (min-width:1024px)": {
            fontSize: "2rem",
            // lineHeight: "2rem",
          },
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
            "@media (min-width:768px)": {
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            },
            "@media (min-width:1024px)": {
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
    MuiInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:before": {
            borderBottomColor: theme.palette.secondary.main, // Default color
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor: theme.palette.secondary.main, // Hover color
          },
          "&:after": {
            borderBottomColor: theme.palette.primary.main, // Focus color
          },
          "&.Mui-error:after": {
            borderBottomColor: theme.palette.primary.main, // Error color
          },
        }),
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          // borderColor: theme.palette.warning,
          color: theme.palette.primary.main,
          //   borderColor: theme.palette.primary.main,
          fontSize: "1rem",
          lineHeight: "1.5rem",
          "@media (min-width:640px)": {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          },
          "@media (min-width:768px)": {
            fontSize: "1.25rem",
            lineHeight: "2rem",
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          "@media (max-width:640px)": {
            fontSize: "1rem",
            lineHeight: "1.5rem",
          },
          "@media (min-width:640px)": {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
          },
          "@media (min-width:768px)": {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          },
          "&.Mui-focused": {
            // When Input Label is focused
            color: theme.palette.secondary.main, // Change label color on focus
            fontSize: "1rem",
            lineHeight: "1.5rem",
            "@media (min-width:640px)": {
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
            },
            "@media (min-width:768px)": {
              fontSize: "1.25rem",
              lineHeight: "1.75rem",
            },
          },
          "&.MuiInputLabel-shrink": {
            color: theme.palette.secondary.main, // Color when the input has a value (shrunk label)
          },
          // '&.Mui-error': {
          //   // When there's an error
          //   color: '#FF0000', // Error label color
          // },
        }),
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: "0.7rem",
          lineHeight: "1.75rem",
          "@media (min-width:768px)": {
            fontSize: "0.9rem",
            lineHeight: "1.75rem",
          },
          "@media (min-width:1024px)": {
            fontSize: "1.1rem",
            lineHeight: "1.75rem",
          },
        },
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
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "0.75rem",
          "@media (max-width:640px)": {
            fontSize: "1rem",
            lineHeight: "1.5rem",
            padding: "1px",
          },

          "@media (min-width:640px)": {
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            padding: "2px",
          },
          "@media (min-width:768px)": {
            fontSize: "1.25rem",
            lineHeight: "2rem",
            padding: "4px",
          },
          variants: [
            {
              props: { variant: "outlined" },
              style: {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-disabled": {
                // opacity: 0.5,
                // color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              },
            },
            {
              props: { variant: "contained" },
              style: {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
              },
              "&.Mui-disabled": {
                opacity: 0.7,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.background.default,
              },
            },
          ],
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
        }),
      },
    },

    // MuiFilledInput: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       backgroundColor: theme.palette.primary.main,
    //       // '&:hover': {
    //       //   backgroundColor: '#e0e0e0',
    //       // },
    //       // '&.Mui-focused': {
    //       //   backgroundColor: '#e0e0e0',
    //       // }),
    //     }),
    //   },
    // },

    // MuiFormLabel: {
    //   styleOverrides: {
    //     root: {
    //       "&.MuiFormControlLabel-asterisk": {
    //         display: "none",
    //       },
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     asterisk: {
    //       display: "none", // Hides the default asterisk for required fields
    //     },
    //   },
    // },
  },
});

export default Theme;
