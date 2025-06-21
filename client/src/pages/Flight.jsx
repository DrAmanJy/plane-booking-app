import { useEffect, useState } from "react";
import { useParams } from "react-router";

const Flight = () => {
  const [seats, setSeats] = useState(1);
  const [classType, setClassType] = useState("Economy");
  const [agree, setAgree] = useState(false);
  const [flight, setFlight] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { flightId } = useParams();

  useEffect(() => {
    const getFlight = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:9000/flight/${flightId}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.message === "Unauthorized")
          throw new Error("Unauthorized, please login");
        if (!res.ok) throw new Error("Flight not found");

        setFlight(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getFlight();
  }, [flightId]);

  if (loading) {
    return <div>Loading, please wait...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/book/${flightId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ seats, class: classType }),
        }
      );

      if (res.ok) {
        alert("Flight booked successfully");
      } else {
        const data = await res.json();
        if (data.message === "Unauthorized") {
          alert(data.message + " Login to book flight");
        } else {
          alert(data.message || "Failed to book flight");
        }
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[92.5vh] bg-blue-50 flex flex-col items-center px-4 py-12">
      <div className="max-w-4xl w-full mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">
          Flight Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section: Basic Info */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-700">Flight:</span>{" "}
              <span className="text-blue-700">
                {flight.airline} ({flight.flightNumber})
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">From:</span>{" "}
              <span className="text-gray-600">{flight.from}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">To:</span>{" "}
              <span className="text-gray-600">{flight.to}</span>
            </p>
          </div>

          {/* Right Section: Timing & Status */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-700">Departure:</span>{" "}
              {flight.departureTime}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Arrival:</span>{" "}
              {flight.arrivalTime}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Duration:</span>{" "}
              {flight.duration}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  flight.status === "on-time"
                    ? "bg-green-100 text-green-700"
                    : flight.status === "delayed"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {flight.status}
              </span>
            </p>
          </div>
        </div>

        {/* Price & Booking CTA */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-xl font-bold text-blue-700">
            Price: ₹{flight.price}
          </p>
          <p className="text-sm text-gray-500">
            {flight.seatsAvailable} out of {flight.totalSeats} seats available
          </p>
        </div>
        {/* Booking Options */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seat Selector */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Select Seats
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            >
              {[...Array(Math.min(6, flight.seatsAvailable)).keys()].map(
                (n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1} Seat{n > 0 ? "s" : ""}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Contact Field */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Select Class
            </label>
            <select
              name="class"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First</option>
            </select>
          </div>
        </div>

        {/* Total Price */}
        <div className="mt-4 text-lg font-semibold text-blue-700">
          Total Price: ₹{seats * flight.price}
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4 flex items-start gap-2">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          <p className="text-sm text-gray-600">
            I agree to the terms and conditions of FlyNow Booking.
          </p>
        </div>

        {/* Confirm Button */}
        <button
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-xl text-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={!agree}
          onClick={handleSubmit}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default Flight;
