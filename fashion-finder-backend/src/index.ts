import { File } from "formdata-node"; // install with: npm i formdata-node
// Add this at the very top of index.ts
(globalThis as any).File = File;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v1 as vision } from "@google-cloud/vision"
import { searchClothing } from "./routes.js";
import multer from "multer";
import * as cheerio from "cheerio";
import axios from 'axios';
import { remove } from "cheerio/dist/commonjs/api/manipulation.js";


const socialMediaLinks = ["instagram", "facebook", "tiktok", "youtube"]

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
        const results = [];
        const similarResults = [];
        if (result.webDetection) {
            for (const page of result.webDetection?.pagesWithMatchingImages ?? []) {
                if (page.url && removeSocialMedia(page.url)) continue;
                for (const image of page.fullMatchingImages ?? []) {
                    let price: string = "$0";
                    if (page.url) {
                        price = await getProductPrice(page.url) ?? "$0";;
                    }
                    results.push({
                        price: price,
                        imageUrl: image.url,
                        pageUrl: page.url
                    });
                }
            }
            for (const page of result.webDetection?.visuallySimilarImages ?? []) {
                if (!page.url || removeSocialMedia(page.url)) continue;
                const googleLensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(page.url)}`;
                similarResults.push({
                    imageUrl: page.url,
                    pageUrl: googleLensUrl
                });
            }
        }
        res.json({ results, similarResults });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Vision API error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


async function getProductPrice(url: string) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const pageText = $('body').text();
        const priceMatch = pageText.match(/[\$\€\£]\d+(\.\d{2})?/);

        const priceText = priceMatch ? priceMatch[0] : "$0";

        return priceText
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

function removeSocialMedia(url: string) {
    return socialMediaLinks.some(link => url.toLowerCase().includes(link.toLowerCase()));
}

