import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

interface ActiveTabsProp {
  activeTab: string;
  onTabChange: (tabValue: string) => void;
  noOfResponses: number;
}

export default function ActiveTabsViewForm({
  activeTab,
  onTabChange,
  noOfResponses,
}: ActiveTabsProp) {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <div className="bg-black rounded-xl mb-5 px-5 pt-2">
      <div className="w-full flex justify-between">
        <p className="text-2xl">{noOfResponses} Responses</p>
        <p>Accept responses </p>
      </div>
      <Tabs className="" value={activeTab} onChange={handleChange} centered>
        <Tab value="summary" label="Summary" />
        <Tab value="individual" label="Individual" />
      </Tabs>
    </div>
  );
}
