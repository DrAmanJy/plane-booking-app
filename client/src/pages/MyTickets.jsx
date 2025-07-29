import { useEffect, useState } from "react";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tickets`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.message === "Unauthorized")
          throw new Error("Please login to see your tickets");
        if (!res.ok) throw new Error("Failed to fetch tickets");
        setTickets(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="bg-white flex h-[90vh] w-screen justify-center items-center gap-5">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (tickets.length === 0)
    return <p className="text-center mt-10">No tickets booked yet.</p>;

  return (
    <div className="min-h-[92.5vh] bg-blue-50 px-4 py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-8">My Tickets</h1>
      <div className="w-full max-w-6xl grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {ticket.flight.airline} ({ticket.flight.flightNumber})
            </h2>
            <p className="text-gray-600 mb-1">
              {ticket.flight.from} ➜ {ticket.flight.to}
            </p>
            <p className="text-gray-600 text-sm">
              Departure:{" "}
              <span className="font-medium">{ticket.flight.departureTime}</span>{" "}
              | Arrival:{" "}
              <span className="font-medium">{ticket.flight.arrivalTime}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Duration: {ticket.flight.duration}
            </p>
            <p className="text-gray-500 text-sm">Class: {ticket.class}</p>
            <p className="text-gray-500 text-sm">
              Seats Booked:{" "}
              <span className="font-semibold">{ticket.seatsBooked}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Booked on:{" "}
              <span className="font-medium">
                {new Date(ticket.bookingDate).toLocaleDateString()}
              </span>
            </p>
            <p
              className={`inline-block text-xs mt-2 px-3 py-1 rounded-full font-medium ${
                ticket.flight.status === "on-time"
                  ? "bg-green-100 text-green-700"
                  : ticket.flight.status === "delayed"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {ticket.flight.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;
