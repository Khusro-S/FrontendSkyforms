import { ThemeProvider } from "@emotion/react";
import Theme from "../../theme/Theme";

export default function ViewForm() {
  return (
    <ThemeProvider theme={Theme}>
      <div>ViewForm</div>
    </ThemeProvider>
  );
}
