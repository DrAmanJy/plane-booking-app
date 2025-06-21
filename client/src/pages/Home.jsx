import { useContext, useState } from "react";
import { FaPlaneDeparture, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
const cities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Goa",
  "Kochi",
  "Indore",
  "Bhopal",
  "Patna",
  "Ranchi",
  "Bhubaneswar",
  "Guwahati",
  "Dehradun",
  "Chandigarh",
  "Coimbatore",
  "Varanasi",
  "Nagpur",
  "Amritsar",
  "Surat",
  "Madurai",
  "Raipur",
  "Trivandrum",
  "Jodhpur",
  "Agartala",
  "Jammu",
  "Udaipur",
  "Vijayawada",
  "Vadodara",
  "Tiruchirappalli",
  "Mangalore",
  "Imphal",
  "Rajkot",
  "Aurangabad",
  "Gaya",
  "Hubli",
  "Shillong",
  "Bagdogra",
  "Port Blair",
  "Leh",
  "Aizawl",
  "Belgaum",
  "Dibrugarh",
  "Silchar",
  "Tezpur",
];
const Home = () => {
  const [query, setQuery] = useState({ from: "", to: "" });
  const { type } = useContext(AuthContext);
  const [activeField, setActiveField] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [flights, setFlights] = useState([]);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));

    if (value.length > 0) {
      const matches = cities.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredSuggestions(matches);
      setShowSuggestions(true);
      setActiveField(name);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.from || !query.to) {
      alert("Please enter both departure and destination cities.");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/flights/${query.from}-${
        query.to
      }`;
      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json();
        setFlights([]);
        console.warn("Flight search failed:", errorData.message);
        alert(errorData.message || "No flights found");
        return;
      }

      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };
  return (
    <div className=" bg-blue-50 flex flex-col items-center px-4 py-12">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 flex justify-center items-center gap-2">
          <FaPlaneDeparture className="text-blue-600" />
          FlyNow Booking
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Book domestic and international flights with ease.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg relative"
      >
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Find Your Flight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="From (City or Airport)"
              name="from"
              onChange={handleInput}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              value={query.from}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showSuggestions &&
              activeField === "from" &&
              filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full border mt-1 rounded bg-white shadow-md z-20">
                  {filteredSuggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setQuery((prev) => ({ ...prev, from: item }));
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="To (City or Airport)"
              name="to"
              onChange={handleInput}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              value={query.to}
              className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showSuggestions &&
              activeField === "to" &&
              filteredSuggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full border mt-1 rounded bg-white shadow-md z-20">
                  {filteredSuggestions.map((item, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        setQuery((prev) => ({ ...prev, to: item }));
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition"
        >
          <FaSearch />
          Search Flights
        </button>
      </form>

      <div className="min-h-[42vh]">
        {flights?.length > 0 && (
          <div className="w-full max-w-6xl mt-10 flex flex-wrap justify-center gap-6 px-4">
            {flights.map((flight, index) => (
              <div
                key={index}
                className="w-full sm:w-[48%]  bg-white shadow-md rounded-2xl p-6 border border-gray-200 flex flex-col justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-800">
                    {flight.airline} ({flight.flightNumber})
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {flight.from} ➜ {flight.to}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Departure:{" "}
                    <span className="font-medium">{flight.departureTime}</span>|
                    Arrival:{" "}
                    <span className="font-medium">{flight.arrivalTime}</span>{" "}
                    <br />
                    Duration: {flight.duration}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Seats: {flight.seatsAvailable}/{flight.totalSeats}
                  </p>
                </div>
                <div className="mt-4 flex flex-col items-start text-left">
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{flight.price}
                  </p>
                  <span
                    className={`text-sm mt-2 px-3 py-1 rounded-full font-medium ${
                      flight.status === "on-time"
                        ? "bg-green-100 text-green-700"
                        : flight.status === "delayed"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {flight.status}
                  </span>
                  {flight.status !== "cancelled" && (
                    <Link
                      to={`flight/${flight._id}`}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm w-full"
                    >
                      Book Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-10 text-gray-500 text-sm">
        © 2025 FlyNow. by Aman Lathar.
      </footer>
    </div>
  );
};

export default Home;
