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
import ViewForm from "./components/blankForm/ViewForm.tsx";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} errorElement={<PageNotFound />}>
        <Route path="/" element={<Homepage />} />
        <Route
          path="blank-form/:id"
          element={<BlankForm />}
          // action={blankFormAction}
        />
        <Route path="form/:id" element={<ViewForm />} />
        {/* <Route path="responses/:id" element={<Responses />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
