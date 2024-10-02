module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // We will use this `io` in routes to emit events
  global.io = io; // Make the io instance globally accessible
};
