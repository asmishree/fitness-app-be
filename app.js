import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js"
import dietRoutes from "./routes/dietRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import bodyParser from "body-parser";
import cors from "cors"

export const app = express();
app.use(bodyParser.json());

// congig.env file must be define 1st on the top to use the env variable. otherwiste face env varable not work.
config({
    path: "./data/config.env",
  });

app.use(
  cors({
    origin: [process.env.FE_URL, "http://localhost:3000","http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
  
);

// to use CORS everywhare use only app.use(cors()); and its done.

// app.use(cors({
//   origin: '*',
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// }));



//Using Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/diet", dietRoutes);
app.use("/api/v1/contact", contactRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

