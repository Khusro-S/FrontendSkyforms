import { ThemeProvider } from "@emotion/react";
import Theme from "../../theme/Theme";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";

export default function ViewForm() {
  const currentFormId = useSelector(
    (state: RootState) => state.forms.currentFormId
  );
  return (
    <ThemeProvider theme={Theme}>
      <div>{currentFormId}</div>
    </ThemeProvider>
  );
}
