import { type Request, type RequestHandler } from "express";
import { ClientError } from "./error";
import { getUserByName } from "./service/users";
import { verify } from "@felix/argon2";
import { usersTable } from "./db/schema";

type AuthAdditions = {
  id: string
}

export type UnauthedRequest = Request & Partial<AuthAdditions>
export type AuthedRequest = Request & AuthAdditions

export function requireRole(role: typeof usersTable.$inferInsert.role): RequestHandler {
  return async (req: UnauthedRequest, _res, next) => {
    const auth = req.headers["authorization"];
    const [user, pw] = auth.split(":");

    const record = await getUserByName(user);

    if (record && verify(record.hash, pw || "")) {
      req.id = user
      if (role !== record.role) next(new ClientError(`${user} is forbidden from accessing this resource`, 403))
      else next()
      return
    }

    next(new ClientError(`${user} is not authenticated`, 401))
  }
}
