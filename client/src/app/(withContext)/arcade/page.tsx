import ArcadeClient from "./ArcadeClient";
import GameplayNavbar from "@/components/gameplay/components/GameplayNavbar";
import styles from "./page.module.css";
import { dummyQuestion, placeholderQuestion, Question } from "@/lib/gameplay/utils";
import { printd } from "@/lib/utils/debugUtils";
import { getQuestionById } from "@/lib/apiServer/gameplay";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ qid: string }>;
}) {
	// const { qid } = await searchParams;

	// printd("@app/(withContext)/arcade/page.tsx", `Loading question with QID: ${qid}`);

	// const response = await getQuestionById(qid);

	// if (response.status === 200) {
	// 	const q = response.data as Question; 

	// 	printd("@app/(withContext)/arcade/page.tsx", `Fetched question data:`, response.data.title);

	// 	const initialServerData = {
	// 		questions: [q],
	// 		initialTime: 900,
	// 	}

	// 	return (
	// 		<div className={styles.container}>
	// 			<GameplayNavbar initialTime={initialServerData.initialTime} />
	// 			<ArcadeClient initialServerData={initialServerData} />
	// 		</div>
	// 	)
	// }

	// if (response.status === 401) {
	// 	redirect("/portal");
	// }

	// throw new Error("Failed to load question data. HTTP Status: " + response.status);

	return (
		<div className={styles.container}>
			<GameplayNavbar initialTime={900} />
			<ArcadeClient initialServerData={{ questions: [dummyQuestion, placeholderQuestion], initialTime: 900 }} />
		</div>
	)
}