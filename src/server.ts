import "dotenv/config";
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = Number(config.port) || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Start the server only in non-serverless environments
if (process.env.VERCEL !== "1") {
  main();
}

// Export the app for Vercel serverless
export default app;