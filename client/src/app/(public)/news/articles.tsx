import { DuckCodeGlobalInvitational } from "./articles/announcements/DuckCodeGlobalInvitational";
import { WelcomeToDuckCode } from "./articles/introduction/WelcomeToDuckCode";
import { Version_1_0 } from "./articles/updates/Version_1_0";

export type Tag = 
    "Updates" | // articles related to in-game version events and updates
    "Dev Notes" | // articles directly from developers about technical details
    "Announcement" | // general announcements uncategorised into any other tags
    "Guides" | // learning resources and tips
    "Community" | // highlights from the community
    "Introduction"; // welcome content for onboarding players

export const articleTags: Tag[] = [
    "Introduction",
    "Updates",
    "Dev Notes",
    "Announcement",
    "Guides",
    "Community",
]

type Article = {
    title: string;
    date: string;
    summary: string;
    tags: Tag[];
    content: React.ReactNode;
}

export function formatDatetimeString(datetime: string) {
    const monthMap: Record<string, string> = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December",
    };

    const [year, month, day] = datetime.split("-");
    return `${day} ${monthMap[month]}, ${year}`
}

export const ARTICLES: Article[] = [
    {
        title: "Welcome to DuckCode!",
        date: "2025-01-20",
        summary: "Let us go through what DuckCode has to offer you, before grabbing your keyboard and waddle right into the Pond!",
        tags: ["Introduction"],
        content: <WelcomeToDuckCode />,
    },
    {
        title: "DuckCode Global Invitational - The Wetlands coming to you...",
        date: "2025-01-20",
        summary: "The most anticipated global invitational of DuckCode, the Wetlands, is coming right to you!",
        tags: ["Announcement"],
        content: <DuckCodeGlobalInvitational />,
    },
    {
        title: "DuckCode v1.0 is in production!",
        date: "2025-01-20",
        summary: "A developer's sneak peek into the first iteration of DuckCode.",
        tags: ["Updates"],
        content: <Version_1_0 />,
    },
];