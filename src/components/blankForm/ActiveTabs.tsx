import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "inherit",
          color: "#E6DCFD",
          "&.Mui-selected": {
            color: "#E6DCFD",
            // backgroundColor: "#1a1a1a",
          },

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
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#E6DCFD",
          height: "4px",
          borderRadius: "4px",
        },
      },
    },
  },
});

export default function ColorTabs() {
  const [value, setValue] = React.useState("questions");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Tabs
        className="bg-black rounded-xl"
        value={value}
        onChange={handleChange}
        centered

        // value={value}
        // onChange={handleChange}
        // indicatorColor="secondary"
        // aria-label="secondary tabs example"
        // centered
        // sx={{
        //   fontSize: {
        //     xs: "14px", // Small font size for mobile screens
        //     sm: "16px", // Font size for small screens (>=640px)
        //     md: "18px", // Font size for medium screens (>=768px)
        //     lg: "20px", // Font size for large screens (>=1024px)
        //   },
        //   "& .MuiTab-root": {
        //     color: "#E6DCFD", // Customize tab text color
        //     padding: "12px 16px", // Adjust tab padding
        //     // fontFamily: "inherit",
        //     fontSize: {
        //       xs: "14px", // Small font size for mobile screens
        //       sm: "16px", // Font size for small screens (>=640px)
        //       md: "18px", // Font size for medium screens (>=768px)
        //       lg: "20px", // Font size for large screens (>=1024px)
        //     },
        //     borderRadius: "20px",
        //     // "&:hover": {
        //     //   color: "blue", // Change text color on hover
        //     // },
        //   },
        //   "& .MuiTabs-indicator": {
        //     backgroundColor: "#E6DCFD", // Customize the indicator color
        //     height: "2px", // Increase the height of the indicator
        //     borderRadius: "8px",
        //   },
        // }}
      >
        <Tab value="questions" label="Questions" />
        <Tab value="responses" label="Responses" />
      </Tabs>
    </ThemeProvider>
  );
}
