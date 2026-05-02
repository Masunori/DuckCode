export type LessonInfo = {
    id: string;
    title: string;
    description: string;
    route: string;
    exp: number;
    solved?: boolean;
    preRequisites?: string[]; // Array of lesson IDs that are prerequisites for this lesson
}

export type TopicInfo = {
    id: string;
    title: string;
    lessons: LessonInfo[];
}

export const tutorialTopics: TopicInfo[] = [
    {
        id: "how-to-duck-code",
        title: "How to DuckCode?",
        lessons: [
            {
                id: "getting-started",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
                solved: false,
            },
            {
                id: "getting-started-2",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
                solved: false,
            },
        ]
    },
    {
        id: "intro-python",
        title: "Introduction to Python",
        lessons: [
            {
                id: "getting-started-3",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
            {
                id: "getting-started-4",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
        ]
    },
    {
        id: "data-structures-and-algorithms",
        title: "Data Structures and Algorithms",
        lessons: [
            {
                id: "getting-started-5",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
            {
                id: "getting-started-6",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
        ]
    },
    {
        id: "competitive-programming",
        title: "Competitive Programming",
        lessons: [
            {
                id: "getting-started-7",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
            {
                id: "getting-started-8",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
        ]
    },
    {
        id: "db",
        title: "Databases",
        lessons: [
            {
                id: "getting-started-9",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
            {
                id: "getting-started-10",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
        ]
    },
    {
        id: "ai-ml",
        title: "Artificial Intelligence and Machine Learning",
        lessons: [
            {
                id: "getting-started-11",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
            {
                id: "getting-started-12",
                title: "Getting Started",
                description: "Learn how to navigate the DuckCode platform, understand the different game modes, and start your coding journey.",
                route: "/getting-started",
                exp: 100,
            },
        ]
    },
]