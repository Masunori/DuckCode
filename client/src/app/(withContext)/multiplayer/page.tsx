import { PLKeys } from "@/components/settings/settingsUtils";
import MultiplayerClient from "./MultiplayerClient";
import styles from './page.module.css';
import { dummyQuestion, placeholderQuestion } from "@/lib/gameplay/utils";

export default async function Page() {
    // in the real app, load the question and fetch other players' info to pass to multiplayer client

    const questions = [dummyQuestion, placeholderQuestion];

    const initialServerData = {
        questions: questions,
        initialTime: 900,
        programmingLanguage: "JavaScript" as PLKeys,
        teammatesIds: ["user1", "user2"],
    }
    
    return (
        <div className={styles.container}>
            <MultiplayerClient initialServerData={initialServerData} />
        </div>
    )
}