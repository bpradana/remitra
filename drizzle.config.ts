import type { Config } from "drizzle-kit";
export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "./db.sqlite",
    },
} satisfies Config;