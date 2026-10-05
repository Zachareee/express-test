import express, { ErrorRequestHandler } from "express"
import { AuthedRequest, requireRole } from "./auth";
import { ClientError } from "./error";
import * as userService from "./service/users"

const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello");
})

app.post("/echo", ({ body }, res) => {
  res.send({ body })
})

app.get("/authedUsers", (_req, res) =>
  userService.getAllUsers().then(users => res.send(users))
)

app.get("/groupedUsers", (_req, res) => {
  userService.groupUsersByRoles().then(res.send.bind(res))
})

app.get("/protected", requireRole("ADMIN"), (req: AuthedRequest, res) => {
  res.send(`Welcome back admin, ${req.id}`)
})

app.post("/login", requireRole("USER"), (req: AuthedRequest, res) => {
  res.format({
    json() {
      return res.send({ message: `You are logged in, ${req.id}` })
    }
  })
})

app.post("/user", requireRole("ADMIN"), async (req: AuthedRequest, res) => {
  const user = userService.createUserSchema.parse(req.body)

  await userService.createUser(user)
  console.log(`${req.id} created a new user`)
  res.send({ message: "User created", data: user })
})

app.use((_req, res) => {
  res.sendStatus(404)
})

const errorHandler: ErrorRequestHandler = (err: ClientError, _req, res, _next) => {
  console.dir(err)
  res.status(err.statusCode ?? 500).send(err.message)
}

app.use(errorHandler)

app.listen({ port: 3000, hostname: "0.0.0.0" }, (e) => {
  if (e) {
    throw e
  }
  console.log("Listening on port 3000")
})
