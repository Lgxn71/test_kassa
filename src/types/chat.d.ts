type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  messageType?: "text" | "audio";
};
