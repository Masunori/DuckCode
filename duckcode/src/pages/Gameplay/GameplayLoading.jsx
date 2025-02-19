import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestionFake } from "../../services/gameplay/getQuestion";
import Loading from "../../globalcomponents/utility_screen/Loading";

export default function GameplayLoading() {
    const navigate = useNavigate();

    const difficulty = useRef(1000);

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const questionResponse = await getQuestionFake(difficulty.current);
                navigate(`/gameplay/qid/${questionResponse.qid}`, { state: { questionResponse } });
            } catch (error) {
                console.error(error);
            }
        }

        fetchQuestion();
    }, [navigate]);

    return <Loading />;
}