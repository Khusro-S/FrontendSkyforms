import { Outlet } from "react-router-dom";
export default function RootLayout() {
  return (
    <div className="w-full min-h-screen flex flex-col overflow-hidden">
      <Outlet />
    </div>
  );
}
