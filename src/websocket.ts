
import { io } from "./http";
import { v4 as uuidv4 } from "uuid";

type ChatRoom = {
  id: string;
  users: string[];
};

// Define a queue to hold users who are searching for someone to chat with
const userQueue: string[] = [];

// Define a map to hold chat rooms and their associated users
const chatRooms: ChatRoom[] = [];

function createChatConnection() {
  if (userQueue.length >= 2) {
    const user1 = userQueue.shift()!;
    const user2 = userQueue.shift()!;
    const chatRoomId = uuidv4();

    io.to(user1).emit("chatConnected", { chatRoomId, partnerId: user2 });
    io.to(user2).emit("chatConnected", { chatRoomId, partnerId: user1 });

    // Create a chat room and add the two users to the room
    const chatRoom: ChatRoom = {
      id: chatRoomId,
      users: [user1, user2],
    };
    chatRooms.push(chatRoom);
  }
}

function endChat(socketId: string) {
  const chatRoom = chatRooms.find((chatRoom) =>
    chatRoom.users.includes(socketId)
  );
  if (chatRoom) {
    chatRoom.users.forEach((user) => {
      io.to(user).emit("chatEnded");
    });
    const index = chatRooms.indexOf(chatRoom);
    chatRooms.splice(index, 1);
  }
}

io.on("connection", (socket) => {
  socket.on("message", (chatRoomId: string, message: string) => {
    const chatRoom = chatRooms.find((chatRoom) => chatRoom.id === chatRoomId);
    if (chatRoom) {
      if (message.charAt(0) === "/") {
        const command = message.split(" ")[0];
        const argument = message.split(" ")[1];
        if (command === "/tictactoe") {
          const gameId = uuidv4();
          const game = {
            id: gameId,
            type: "TICTACTOE",
            moves: [],
          }

          chatRoom.users.forEach((user) => {
            io.to(user).emit("message", {
              message: argument || "Tic Tac Toe",
              sender: socket.id,
              timestamp: Date.now(),
              game: game,
            });
          });
        }
        return;
      } else {
        chatRoom.users.forEach((user) => {
          io.to(user).emit("message", {
            message: message,
            sender: socket.id,
            timestamp: Date.now(),
          });
        });
      }
    }
  });

  socket.on("gameMove", (chatRoomId, { gameId, player, move }: { gameId: string, player: string, move: string }) => {
    const chatRoom = chatRooms.find((chatRoom) => chatRoom.id === chatRoomId);
    if (chatRoom) {
      chatRoom.users.forEach((user) => {
        io.to(user).emit("gameMove", {
          gameId: gameId,
          player: player,
          move: move
        });
      });
    }
  });

  socket.on("startSearch", (callback) => {
    if (!userQueue.includes(socket.id)) {
      userQueue.push(socket.id);
      createChatConnection();
      callback({
        status: "success"
      })
    }
  });

  socket.on("stopSearch", (callback) => {
    const index = userQueue.indexOf(socket.id);
    userQueue.splice(index, 1);
    callback({
      status: "success"
    })
  });

  socket.on("endChat", () => {
    endChat(socket.id);
  });

  socket.on("disconnect", () => {
    endChat(socket.id);
  });

});