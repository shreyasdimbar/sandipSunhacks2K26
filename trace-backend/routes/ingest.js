/**
 * TRACE Ingest Routes
 *
 * POST /api/ingest — submit a knowledge fragment
 */

import { Router } from "express";
import { ingestData } from "../controllers/ingestController.js";

const router = Router();

router.post("/", ingestData);

export default router;
