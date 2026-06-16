import { Article } from "@/utils/news";
import { DuckCodeGlobalInvitational } from "./announcements/DuckCodeGlobalInvitational";
import { WelcomeToDuckCode } from "./introduction/WelcomeToDuckCode";
import { Version_1_0 } from "./updates/Version_1_0";
import { Version_0_1_1_beta } from "./updates/Version_0_1_1_beta";
import { Version_0_1_3_beta_speculation } from "./updates/Version_0_1_3_beta_speculation";
import { Version_0_1_2_beta } from "./updates/Version_0_1_2_beta";

export const ARTICLES: Article[] = [
    {
        id: 5,
        title: "DuckCode v0.1.3 Beta Speculation",
        date: "2026-06-04",
        summary: "Get a sneak peek at what's coming in the next beta release!",
        tags: ["Updates", "Dev Notes"],
        content: <Version_0_1_3_beta_speculation />,
    },
    {
        id: 4,
        title: "DuckCode v0.1.2 Beta is here!",
        date: "2026-04-18",
        summary: "Check out the latest beta features and improvements!",
        tags: ["Updates", "Dev Notes"],
        content: <Version_0_1_2_beta />,
    },
    {
        id: 3,
        title: "DuckCode v0.1.1 Beta is here!",
        date: "2026-03-04",
        summary: "Check out the latest beta features and improvements!",
        tags: ["Updates", "Dev Notes"],
        content: <Version_0_1_1_beta />,
    },
    {
        id: 2,
        title: "DuckCode v1.0 is in production!",
        date: "2025-01-20",
        summary: "Sneak peek into the first iteration of DuckCode.",
        tags: ["Updates"],
        content: <Version_1_0 />,
    },
    {
        id: 1,
        title: "DuckCode Global Invitational - The Wetlands coming to you...",
        date: "2025-01-20",
        summary: "The most anticipated global invitational of DuckCode, the Wetlands, is coming right to you!",
        tags: ["Announcement"],
        content: <DuckCodeGlobalInvitational />,
    },
    {
        id: 0,
        title: "Welcome to DuckCode!",
        date: "2025-01-20",
        summary: "Let us go through what DuckCode has to offer you, before grabbing your keyboard and waddle right into the Pond!",
        tags: ["Introduction"],
        content: <WelcomeToDuckCode />,
    },
];