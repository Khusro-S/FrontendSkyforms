import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface ActiveTabsProp {
  activeTab: string;
  onTabChange: (tabValue: string) => void;
}

export default function ActiveTabs({ activeTab, onTabChange }: ActiveTabsProp) {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Tabs
      className="bg-black rounded-xl"
      value={activeTab}
      onChange={handleChange}
      centered
    >
      <Tab value="questions" label="Questions" />
      <Tab value="responses" label="Responses" />
    </Tabs>
  );
}
