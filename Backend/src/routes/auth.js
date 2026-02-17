import express from "express";
import {register, login} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { registerValidator } from "../validators/user.validators.js";
import {reqParamsValidator} from "../validators/req.params.validator.js"

const router = express.Router();

router.post("/register", validate(registerValidator, "body"), register);
router.post("/login", login);
router.get("/me", protect, (req, res) => {
    res.json({
        message: "You are authenticated",
        user: req.user
    });
});

export default router;