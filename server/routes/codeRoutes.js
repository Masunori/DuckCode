import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/run", async (req, res) => {
  const { language, source } = req.body;

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language,
      source,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
