import { eq } from "drizzle-orm";
import * as z from "zod"
import _ from "lodash"
import { hash } from "@felix/argon2";

import { db } from "../db";
import { usersTable } from "../db/schema";

export const createUserSchema = z.object({
  name: z.string().nonempty(),
  password: z.string().nonempty()
})

const getName = _.unary(_.partialRight(_.map, "name"))

export async function getAllUsers() {
  return db.select({ name: usersTable.name }).from(usersTable).then(getName)
}

export async function groupUsersByRoles() {
  return db.select({ name: usersTable.name, role: usersTable.role }).from(usersTable).then(users =>
    _(users).groupBy("role").mapValues(getName)
  )
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
