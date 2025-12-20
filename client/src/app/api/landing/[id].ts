import { NextApiRequest, NextApiResponse } from "next";
import articles from "../articledb";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === 'GET') {
        if (articles[id as string]) {
            res.status(200).json(articles[id as string]); // Return the article if found
        } else {
            res.status(404).json({ error: "Article not found" }); // If article not found
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" }); // If the method is not GET
    }
}