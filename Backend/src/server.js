import dotenv from 'dotenv';
import app from "./app.js";
import connectDB from './config/db.js';
import './jobs/eventStateUpdater.js';
import cors from "cors";
import express from "express";

app.use(express.json());

app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});