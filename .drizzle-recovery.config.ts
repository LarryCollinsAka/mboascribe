import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DIRECT_DATABASE_URL or DATABASE_URL is not configured");
}

export default defineConfig({
  schema: "./.drizzle-recovery/schema-v3.ts",
  out: "./.drizzle-recovery/out",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
