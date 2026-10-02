import { eq } from "drizzle-orm";
import * as z from "zod"
import { hash } from "@felix/argon2";

import { db } from "../db";
import { usersTable } from "../db/schema";

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  password: z.string().nonempty()
})

export async function getAllUsers() {
  return db.select({ name: usersTable.name }).from(usersTable).then(users => users.map(({ name }) => name))
}

export async function getUserByName(username: string) {
  return db.select().from(usersTable).where(eq(usersTable.name, username)).get({})
}

export async function createUser({ name, password }: z.infer<typeof createUserSchema>) {
  const user: typeof usersTable.$inferInsert = {
    name,
    hash: await hash(password),
    role: "USER"
  }
  return db.insert(usersTable).values(user)
}
