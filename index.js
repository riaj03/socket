const app = require("express")();
app.set("view engine", "pug");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  pingTimeout: 30000, // 30 Secs
  pingInterval: 5000, // 5 Secs
});

const authToken = process.env.AUTH_TOKEN || "GROOTSSOCKET";
const PORT = process.env.PORT || 8080;
const { storeConnection, getConnections, removeConnection } = require("./service/socketService");
app.get("/check", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// authenticate connection
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  const userId = socket.handshake.query.userId;

  if (token === authToken && userId) {
    next();
  } else {
    console.log("Authentication error");
  }
});

io.on("connection", (socket) => {
  console.log(`A client (${socket.handshake.query.userId}) connected to socket`);
  // storing connection by his user_id
  storeConnection(socket);

  // accept message from client and send to receiver
  socket.on("message", (message, userId) => {
    io.to(getConnections()[userId]).emit("message", message);
  });

  socket.on("disconnect", () => {
    removeConnection(socket.handshake.query.userId);
    console.log(`${socket.handshake.query.userId} disconnected`);
  });
});

http.listen(PORT, () => {
  console.log(`Socket server running on ${PORT}`);
});
