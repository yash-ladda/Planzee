import express from 'express';
const app = express();
app.use(express.json());

import authRoutes from "./routes/auth.js";

app.get("/", (req, res) => {
    res.send("I am root path");
});

app.use("/api/auth", authRoutes);

export default app;