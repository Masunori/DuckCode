import { getQuestionById } from "@/lib/apiServer/gameplay";
import GameplayClient from "./ArcadeClient";
import { Question } from "./arcadeUtils";
import GameplayNavbar from "./components/GameplayNavbar";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { printd } from "@/app/utils/debugUtils";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ qid: string }>;
}) {
	const { qid } = await searchParams;

	printd("@app/(withContext)/arcade/page.tsx", `Loading question with QID: ${qid}`);

	const response = await getQuestionById(parseInt(qid));

	if (response.status === 200) {
		const q = response.data as Question; 

		printd("@app/(withContext)/arcade/page.tsx", `Fetched question data:`, response.data.title);

		const initialServerData = {
			question: q,
			initialTime: 900,
		}

		return (
			<div className={styles.container}>
				<GameplayNavbar initialTime={initialServerData.initialTime} />
				<GameplayClient initialServerData={initialServerData} />
			</div>
		)
	}

	if (response.status === 401) {
		redirect("/portal");
	}

	throw new Error("Failed to load question data. HTTP Status: " + response.status);
}