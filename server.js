const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const route = require("./routes/router");
const http = require("http"); // To create an HTTP server
const { Server } = require("socket.io"); // Import Server from socket.io
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(route);

// Create HTTP server and socket.io
const server = http.createServer(app); // Use the HTTP server for socket.io
const io = new Server(server, {
  cors: {
    origin: true, // Allow any origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Socket.io setup (passing io to routes)
require("./socket")(io); // Import socket logic

// MongoDB connection
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Use the server for listening, not app.listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
