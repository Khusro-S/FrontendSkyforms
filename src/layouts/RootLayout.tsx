import { ThemeProvider } from "@emotion/react";
import { Outlet } from "react-router-dom";
import Theme from "../theme/Theme";
export default function RootLayout() {
  return (
    <ThemeProvider theme={Theme}>
      <div className="w-full min-h-screen flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
