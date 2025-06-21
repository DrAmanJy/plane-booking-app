import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "https://plane-booking-app.onrender.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const flightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    seatsAvailable: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["on-time", "delayed", "cancelled"],
      default: "on-time",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    seatsBooked: { type: Number, required: true },
    class: {
      type: String,
      enum: ["Economy", "Business", "First"],
      default: "Economy",
    },
    bookingDate: { type: Date, default: Date.now },
  },
  { versionKey: false, timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
const Flight = mongoose.model("Flight", flightSchema);
const User = mongoose.model("User", userSchema);

app.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, type: newUser.type },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "User registered and logged in successfully",
        type: newUser.type,
      });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({ message: "Login successful", type: user.type });
    } else {
      return res.status(400).json({ message: "Password not match" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/flights/:from-:to", async (req, res) => {
  try {
    const { from, to } = req.params;

    const flights = await Flight.find({
      from: { $regex: new RegExp(from, "i") },
      to: { $regex: new RegExp(to, "i") },
    });

    if (flights.length === 0) {
      return res.status(404).json({ message: "No flights found" });
    }

    res.status(200).json(flights);
  } catch (err) {
    console.error("Flight search error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/flight/:flightId", async (req, res) => {
  try {
    const { flightId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      return res.status(400).json({ error: "Invalid flight ID format." });
    }

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ error: "Flight not found." });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error("Error fetching flight:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/auth/check", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.status(200).json({ userId: decoded.userId, type: user.type });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});
app.post("/auth/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
});
app.post("/admin/flights", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (user.type !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const newFlight = new Flight(req.body);
    await newFlight.save();

    res.status(201).json({ message: "Flight added successfully" });
  } catch (err) {
    console.error("Flight creation error:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.status(400).json({ message: err.message });
  }
});
app.post("/book/:flightId", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const flightId = req.params.flightId;
    const { seats, class: seatClass } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    const existingTicket = await Ticket.findOne({
      user: userId,
      flight: flightId,
    });
    if (existingTicket) {
      return res
        .status(409)
        .json({ message: "You have already booked this flight." });
    }

    const ticket = new Ticket({
      user: userId,
      flight: flight._id,
      seatsBooked: seats,
      class: seatClass,
    });

    await ticket.save();

    await User.findByIdAndUpdate(userId, {
      $push: { tickets: ticket._id },
    });

    res.status(201).json({ message: "Ticket booked", ticket });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/tickets", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate({
      path: "tickets",
      populate: { path: "flight" },
    });

    res.json(user.tickets);
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});
