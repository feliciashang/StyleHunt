import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v1 as vision } from "@google-cloud/vision"
import { searchClothing } from "./routes.js";
import multer from "multer";

dotenv.config();
const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
const client = new vision.ImageAnnotatorClient();
app.use(express.json());

app.post("/api/search", searchClothing);
app.post("/api/vision", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const [result] = await client.webDetection({
            image: { content: req.file.buffer },
        });

        res.json(result.webDetection);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Vision API error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
