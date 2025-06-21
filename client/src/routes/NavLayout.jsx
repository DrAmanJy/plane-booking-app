import Navbar from "../components/NavBar";
import { Outlet } from "react-router";

const NavLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default NavLayout;
