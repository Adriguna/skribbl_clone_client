import { io } from "socket.io-client";

const SOCKET_URL = "https://skribbl-clone-backend-m4du.onrender.com";

export const socket = io(SOCKET_URL);