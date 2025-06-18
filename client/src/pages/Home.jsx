import React from "react";
import { FaPlaneDeparture, FaSearch } from "react-icons/fa";

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center px-4 py-12">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 flex justify-center items-center gap-2">
          <FaPlaneDeparture className="text-blue-600" />
          FlyNow Booking
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Book domestic and international flights with ease.
        </p>
      </header>

      {/* Booking Form UI */}
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          Find Your Flight
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="From (City or Airport)"
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="To (City or Airport)"
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option>1 Passenger</option>
            <option>2 Passengers</option>
            <option>3 Passengers</option>
            <option>4+ Passengers</option>
          </select>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition">
          <FaSearch />
          Search Flights
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-sm">
        © 2025 FlyNow Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
