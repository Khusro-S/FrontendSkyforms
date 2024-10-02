import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ThemeProvider } from "@mui/material/styles";
import Theme from "../../theme/Theme";

export default function ColorTabs() {
  const [value, setValue] = React.useState("questions");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={Theme}>
      <Tabs
        className="bg-black rounded-xl"
        value={value}
        onChange={handleChange}
        centered
      >
        <Tab value="questions" label="Questions" />
        <Tab value="responses" label="Responses" />
      </Tabs>
    </ThemeProvider>
  );
}
