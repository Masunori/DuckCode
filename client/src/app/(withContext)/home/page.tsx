import { PRISTINE_USER, User } from "@/app/userPrefs/userPrefsUtils"
// import { getProfile } from "@/lib/apiClient/user";
// import { redirect } from "next/navigation";  
import HomeClient from "./HomeClient";

export default async function Page() {
    // const user = useUserStore(state => state.user);
    // const response = await getProfile();
    // console.log(response);

    // if (response.status === 401) {
    //     redirect("/portal");
    // }
    
    return (
        // <HomeClient user={response.data as User} />
        <HomeClient user={PRISTINE_USER as User} />
    )
}