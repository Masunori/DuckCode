import ArcadeClient from "./ArcadeClient";
import styles from "./page.module.css";
import { printd } from "@/utils/debugUtils";
import { createServerClient } from "@/services/apiServer/serverClient";
import { redirect } from "next/navigation";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ qid: string }>;
}) {
	const { qid } = await searchParams;

	printd("@app/(withContext)/arcade/page.tsx", `Loading question with QID: ${qid}`);

	const serverClient = await createServerClient();
	const response = await serverClient.question.getQuestionById(qid);

	if (response.status === 200 && response.data) {
		const question = response.data;

		printd("@app/(withContext)/arcade/page.tsx", `Fetched question data:`, question.title);

		const initialServerData = {
			questions: [question]
		}

		return (
			<div className={styles.container}>
				<ArcadeClient initialServerData={initialServerData} />
			</div>
		)
	}

	if (response.status === 401) {
		redirect("/portal");
	}

	throw new Error("Failed to load question data. HTTP Status: " + response.status);

	// return (
	// 	<div className={styles.container}>
	// 		<GameplayNavbar initialTime={900} />
	// 		<ArcadeClient initialServerData={{ questions: [dummyQuestion, placeholderQuestion], initialTime: 900 }} />
	// 	</div>
	// )
}
