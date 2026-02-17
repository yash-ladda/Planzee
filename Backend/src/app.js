import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import participationRoutes from "./routes/participation.js";
import reviewRoutes from "./routes/review.js";
import { errorHandler } from './middlewares/errorMiddleware.js';

app.get("/", (req, res) => {
    res.send("I am root path");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", participationRoutes);
app.use("/api", reviewRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use(errorHandler);

export default app;