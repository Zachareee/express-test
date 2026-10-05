import { db } from "./src/db";
import { usersTable } from "./src/db/schema";
import * as argon from "@felix/argon2";

await db.delete(usersTable)

const user: typeof usersTable.$inferInsert[] = [
  {
    name: "zachary",
    hash: await argon.hash("password"),
    role: "ADMIN"
  },
  {
    name: "devania",
    hash: await argon.hash("lovescats"),
    role: "USER"
  }
];

await db.insert(usersTable).values(user);

const users = await db.select().from(usersTable);
console.log(`Got all users:`, users);
