/**
 * TRACE Query Routes
 *
 * POST /api/query — ask a question about company knowledge
 */

import { Router } from "express";
import { queryTrace } from "../controllers/queryController.js";

const router = Router();

router.post("/", queryTrace);

export default router;
