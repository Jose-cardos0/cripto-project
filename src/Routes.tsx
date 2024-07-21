import { createBrowserRouter } from "react-router-dom";

import { Home } from "./Pages/Home/Home";
import { Detail } from "./Pages/Detail/Detail";
import { NotFound } from "./Pages/NotFound/NotFound";
import { Layout } from "./Components/Layout/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/detail/:cripto", element: <Detail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export { router };
