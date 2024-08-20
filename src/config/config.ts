import dotenv from "dotenv";
dotenv.config();

if (!process.env.TG_BOT_TOKEN) {
  throw Error("INPUT YOUR TELEGRAM BOT TOKEN");
}

const config = {
  getTgBotToken: () => process.env.TG_BOT_TOKEN as string,
};

export default config;
