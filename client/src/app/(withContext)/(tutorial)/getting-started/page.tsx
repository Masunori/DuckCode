import { getQuestionById } from "@/lib/apiServer/gameplay"
import { Question } from "@/lib/gameplay/utils";
import GettingStartedClient from "./GettingStartedClient";
import { redirect } from "next/navigation";

export default async function Page() {
    const response = await getQuestionById("getting-started");

	if (response.status === 200) {
		const q = response.data; 

		q.examples = q.examples.map((ex: any) => {
			ex.input = (ex.input as string).split('\n');
			ex.output = (ex.output as string).split('\n');
			return ex;
		});

		const qq = q as Question;

		return (
			<GettingStartedClient question={qq} />
		)
	}

	if (response.status === 401) {
		redirect("/portal");
	}
}