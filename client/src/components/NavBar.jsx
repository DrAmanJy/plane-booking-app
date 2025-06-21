import { useContext } from "react";
import { FaPlaneDeparture } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { type, setType } = useContext(AuthContext);
  const navigate = useNavigate();
  const handBtnClick = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setType(null);
        alert(data.message);
        navigate("/");
      }
    } catch (err) {
      alert("Logout failed", err);
    }
  };
  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky   top-0 left-0 right-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-2 text-blue-800 font-bold text-xl md:text-2xl"
      >
        <FaPlaneDeparture className="text-blue-600" />
        FlyNow
      </Link>

      <div className="flex items-center gap-4 text-sm md:text-base">
        {type ? (
          <button
            onClick={handBtnClick}
            className="text-blue-600 hover:text-blue-800 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/auth?type=login"
              className="text-blue-600 hover:text-blue-800 transition"
            >
              Login
            </Link>
            <Link
              to="/auth?type=signup"
              className="text-blue-600 hover:text-blue-800 transition"
            >
              Signup
            </Link>
          </>
        )}

        {type === "admin" ? (
          <>
            <Link
              to="/tickets"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            >
              My Tickets
            </Link>
            <Link
              to="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
            >
              Admin
            </Link>
          </>
        ) : (
          <Link
            to="/tickets"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
          >
            My Tickets
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
