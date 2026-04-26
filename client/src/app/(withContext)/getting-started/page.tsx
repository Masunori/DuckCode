import { getQuestionById } from "@/lib/apiServer/gameplay"
import { Question } from "@/lib/gameplay/utils";
import GettingStartedClient from "./GettingStartedClient";
import { redirect } from "next/navigation";

export default async function Page() {
    const response = await getQuestionById("getting-started");

	if (response.status === 200) {
		const q = response.data as Question;

		return (
			<GettingStartedClient question={q} />
		)
	}

	if (response.status === 401) {
		redirect("/portal");
	}
}