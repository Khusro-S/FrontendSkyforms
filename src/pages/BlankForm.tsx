import ActiveTabs from "../components/blankForm/ActiveTabs";
import BlankFormNavbar from "../components/blankForm/BlankFormNavbar";
import QuestionsForm from "../components/blankForm/QuestionsForm";

export default function BlankForm() {
  return (
    <div className="flex flex-col lg:gap-5 gap-3">
      <header className="flex flex-col justify-center items-center">
        <BlankFormNavbar />
        <ActiveTabs />
      </header>
      <main>
        <QuestionsForm />
      </main>
    </div>
  );
}
