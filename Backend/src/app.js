import express from 'express';
const app = express();

app.get("/", (req, res) => {
    res.send("I am root path");
});

export default app;