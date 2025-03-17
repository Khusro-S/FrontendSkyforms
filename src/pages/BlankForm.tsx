import { useState } from "react";
import ActiveTabs from "../components/blankForm/ActiveTabs";
import BlankFormNavbar from "../components/blankForm/BlankFormNavbar";
import QuestionsForm from "../components/blankForm/QuestionsForm";
import ResponsesView from "../components/blankForm/ResponsesView";

export default function BlankForm() {
  const [activeTab, setActiveTab] = useState("questions");

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="flex flex-col lg:gap-5 gap-3">
      <header className="flex flex-col justify-center items-center">
        <BlankFormNavbar />
        <ActiveTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </header>
      <main>
        {activeTab == "questions" ? <QuestionsForm /> : <ResponsesView />}
      </main>
    </div>
  );
}
