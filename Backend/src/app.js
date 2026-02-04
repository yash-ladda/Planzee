import express from 'express';
const app = express();
app.use(express.json());

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";
import reviewRoutes from "./routes/review.js";

app.get("/", (req, res) => {
    res.send("I am root path");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", participationRoutes);
app.use("/api", reviewRoutes);

export default app;