import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Flight from "../pages/Flight";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <Home />,
  },
  {
    path: "auth",
    element: <Auth />,
  },
  {
    path: "flight/:flightName",
    element: <Flight />,
  },
]);
