// When clicking on a game menu button, there may be tabs that allow the user to customise what they want to do before proceeding.
export type GameMenuTab = "" | "Multiplayer" | "Arcade" | "Playground" | "Tutorial" | "Join/Host a Private Match" | "Inventory" | "Clan";

export type GameMode = {
    name: string;
    description: string;
}

export const GAME_MODES: Record<string, GameMode> = {
    classic: { name: "Classic", description: "Solve programming questions that revolve around Data Structures and Algorithms, Competitive Programming, and more." }, 
    regex: { name: "RegEx", description: "Guess as many regular expressions as possible based on the sequence of given Finite State Automata." },
    aiMl: { name: "AI/ML", description: "Using whatever machine learning algorithm you want, create the strongest model that can most accurately predict something based on given data." },
    database: { name: "Database", description: "Get the data you want from a database with the expressive power of SQL queries." },
    fixTheCode: { name: "Fix the Code", description: "Patch the faulty code before everything breaks down." },
}