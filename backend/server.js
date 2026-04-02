import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRoutes from  "./routes/post.routes.js";
import userRoutes from  "./routes/user.routes.js";


dotenv.config();


const app=express();

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

//middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy does not allow this origin"));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use((req, res) => {
    console.log(`404 occurred! Method: ${req.method} | Path: ${req.url}`);
    res.status(404).send("Route not found on server");
});

const start = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not set");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB Successfully! ✅");

    const port = process.env.PORT || 9090;

    app.listen(port, () => {
      console.log(`Server is running on port ${port} 🚀`);
    });
  } catch (error) {
    console.error("CRITICAL ERROR: Could not connect to MongoDB! ❌");
    console.error(error.message);
  }
};

start();