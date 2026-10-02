import express, { ErrorRequestHandler } from "express"
import { AuthedRequest, requireRole } from "./auth";
import { ClientError } from "./error";
import * as userService from "./service/users"

const app = express()

app.use(express.json())

app.get("/", (_req, res) => {
  res.send("Hello");
})

app.post("/echo", (req, res) => {
  const { body } = req
  res.send({ body })
})

app.get("/authedUsers", async (_req, res) => {
  res.send(await userService.getAllUsers())
})

app.get("/protected", requireRole("ADMIN"), (req: AuthedRequest, res) => {
  res.send(`Welcome back, ${req.id}`)
})

app.post("/user", requireRole("ADMIN"), async (req: AuthedRequest, res) => {
  const user = userService.createUserSchema.parse(req.body)

  await userService.createUser(user)
  console.log(`${req.id} created a new user`)
  res.send({ message: "User created", data: user })
})

app.use((_req, res) => {
  res.status(404).send("Not found")
})

const errorHandler: ErrorRequestHandler = (err: ClientError, _req, res, _next) => {
  res.status(err.statusCode ?? 500).send(err.message)
}

app.use(errorHandler)

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
