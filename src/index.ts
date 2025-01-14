import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

// Load environment variables
const envFile = process.env.ENV_FILE || ".env.dev";
dotenv.config({ path: envFile });

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_CHAT_ID = process.env.TARGET_CHAT_ID;
const ENV = process.env.ENV;

if (!BOT_TOKEN || !TARGET_CHAT_ID) {
  console.error("Error: BOT_TOKEN and TARGET_CHAT_ID must be set in .env file");
  process.exit(1);
}

// Create a bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Log env
console.log(`Environment: ${ENV}`);

// Log when bot starts
console.log("Bot is running...");

// Handle incoming messages
bot.on("message", async (msg) => {
  try {
    // Check if message contains a poll
    if (msg.poll) {
      // Check if poll question contains "Анонс:" (case-insensitive)
      const question = msg.poll.question;
      if (question.toLowerCase().includes("анонс:")) {
        const sourceChatId = msg.chat.id;
        const messageId = msg.message_id;

        console.log(`Forwarding announcement poll from chat ${sourceChatId}`);
        console.log(`Poll question: ${question}`);

        // Forward the message to target chat
        await bot.forwardMessage(
          TARGET_CHAT_ID,
          sourceChatId.toString(),
          messageId
        );

        console.log("Poll forwarded successfully");
      }
    }
  } catch (error) {
    console.error("Error forwarding poll:", error);
  }
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});

bot.on("error", (error) => {
  console.error("General error:", error);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down gracefully...");
  try {
    await bot.stopPolling();
    console.log("Polling stopped");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Handle termination signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
