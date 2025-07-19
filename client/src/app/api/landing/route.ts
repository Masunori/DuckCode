import articles from "../articledb";

export async function GET() {
    return Response.json(articles);
}

export async function POST(request: Request) {
    try {
        const { articleId } = await request.json();

        const article = articles[articleId];

        if (!article) {
            return new Response(JSON.stringify({ error: "Article not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(article), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: `Failed to fetch article: ${error}` }), { status: 500 });
    }
}