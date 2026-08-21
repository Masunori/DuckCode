import { createServerClient } from "@/services/apiServer/serverClient";
import GettingStartedClient from "./GettingStartedClient";
import { redirect } from "next/navigation";

export default async function Page() {
    const serverClient = await createServerClient();
    const response = await serverClient.question.getQuestionById("getting-started");

	if (response.status === 200 && response.data) {
		return (
			<GettingStartedClient question={response.data} />
		)
	}

	if (response.status === 401) {
		redirect("/portal");
	}
}
