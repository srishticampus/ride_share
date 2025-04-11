//server/server.js
import app from "./app.js";
import { connect } from "mongoose";
import { PORT, MONGO_URI } from "./src/config/env.config.js";

// Connect to MongoDB
connect(MONGO_URI)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
