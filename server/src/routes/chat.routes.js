import { Router } from "express";
import { getQuestion } from "../controllers/chat.controllers.js";
const router = Router();

router.get("/question", getQuestion);

export default router;
