export type Tag = 
    "Updates" | // articles related to in-game version events and updates
    "Dev Notes" | // articles directly from developers about technical details
    "Announcement" | // general announcements uncategorised into any other tags
    "Guides" | // learning resources and tips
    "Community" | // highlights from the community
    "Introduction"; // welcome content for onboarding players

export const ARTICLE_TAGS: Tag[] = [
    "Introduction",
    "Updates",
    "Dev Notes",
    "Announcement",
    "Guides",
    "Community",
]

export type Article = {
    id: number;
    title: string;
    date: string;
    summary: string;
    tags: Tag[];
    content: React.ReactNode;
}