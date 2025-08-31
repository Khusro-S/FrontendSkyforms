import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//layouts
import RootLayout from "./layouts/RootLayout.tsx";

//pages
import PageNotFound from "./pages/PageNotFound.tsx";
import Homepage from "./pages/Homepage.tsx";
import BlankForm from "./pages/BlankForm.tsx";
import ViewForm from "./components/viewForm/ViewForm.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import { useEffect } from "react";
import { validateTokenThunk } from "./store/authSlice.ts";
import { useAppDispatch } from "./store/typedHooks.ts";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<PageNotFound />}>
        <Route path="auth" element={<AuthPage />} />

        {/* Protected Routes  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Homepage />} />
          <Route
            path="blank-form/:id"
            element={<BlankForm />}
            // action={blankFormAction}
          />
        </Route>
        <Route path="form/:id" element={<ViewForm />} />
        {/* <Route path="responses/:id" element={<Responses />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Dispatch the validateTokenThunk on component mount
    dispatch(validateTokenThunk());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
