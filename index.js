const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const session = require("express-session");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
let RedisStore = require("connect-redis")(session);

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  SESSION_SECRET,
  REDIS_PORT,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});
const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("->Database connected");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUnitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server running");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server running at" + port);
});
