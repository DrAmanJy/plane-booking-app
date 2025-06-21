import { createBrowserRouter } from "react-router";
import NavLayout from "./NavLayout";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import Flight from "../pages/Flight";
import AdminAddFlight from "../pages/AdminAddFlight";
import MyTickets from "../pages/MyTickets";
import ProtectedRoute from "../components/ProtectedRoute";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <NavLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "flight/:flightId",
        element: <Flight />,
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin",
            element: <AdminAddFlight />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          {
            path: "tickets",
            element: <MyTickets />,
          },
        ],
      },
    ],
  },
]);
