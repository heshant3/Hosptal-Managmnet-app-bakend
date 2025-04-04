require("dotenv").config();
const WebSocket = require("ws");

// Function to initialize WebSocket server with an existing HTTP server
function initializeWebSocketServer(httpServer) {
  const wss = new WebSocket.Server({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established from a client.");

    // Notify the frontend that the connection is successful
    ws.send("Backend WebSocket connected successfully.");

    // Handle incoming messages
    ws.on("message", (message) => {
      console.log("Received message from client:", message);
      // Echo the message back to the client
      ws.send(`Server: ${message}`);
    });

    // Handle client disconnection
    ws.on("close", () => {
      console.log("WebSocket connection closed by client.");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error occurred:", error);
    });
  });

  console.log("WebSocket server initialized.");
}

module.exports = initializeWebSocketServer;
