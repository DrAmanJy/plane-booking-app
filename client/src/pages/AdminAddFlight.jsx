import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";

const AdminAddFlight = () => {
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    seatsAvailable: "",
    totalSeats: "",
    price: "",
    status: "on-time",
  });
  const { type } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/flights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Flight added successfully");
        setFormData({
          flightNumber: "",
          airline: "",
          from: "",
          to: "",
          departureTime: "",
          arrivalTime: "",
          duration: "",
          seatsAvailable: "",
          totalSeats: "",
          price: "",
          class: "Economy",
          status: "on-time",
        });
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add flight");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Add New Flight
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md grid gap-4 grid-cols-1 sm:grid-cols-2"
      >
        <input
          name="flightNumber"
          type="text"
          placeholder="Flight Number"
          value={formData.flightNumber}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="airline"
          type="text"
          placeholder="Airline"
          value={formData.airline}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="from"
          type="text"
          placeholder="From"
          value={formData.from}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="to"
          type="text"
          placeholder="To"
          value={formData.to}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="departureTime"
          type="text"
          placeholder="Departure Time (e.g., 02:30 PM)"
          value={formData.departureTime}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="arrivalTime"
          type="text"
          placeholder="Arrival Time (e.g., 04:45 PM)"
          value={formData.arrivalTime}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="duration"
          type="text"
          placeholder="Duration"
          value={formData.duration}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="seatsAvailable"
          type="text"
          placeholder="Seats Available"
          value={formData.seatsAvailable}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="totalSeats"
          type="text"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          name="price"
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="on-time">On-Time</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="col-span-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl"
        >
          Add Flight
        </button>
      </form>
    </div>
  );
};

export default AdminAddFlight;
