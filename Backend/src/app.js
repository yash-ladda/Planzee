import express from 'express';
const app = express();
app.use(express.json());

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";

app.get("/", (req, res) => {
    res.send("I am root path");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", participationRoutes);

export default app;