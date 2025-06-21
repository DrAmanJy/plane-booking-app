import { useSearchParams } from "react-router";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Home from "./Home";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (type === "login") {
    return <Login />;
  } else if (type === "signup") {
    return <Signup />;
  } else {
    return <Home />;
  }
};

export default Auth;
