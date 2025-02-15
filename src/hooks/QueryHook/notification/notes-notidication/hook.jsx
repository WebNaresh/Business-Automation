import axios from "axios";
import { useQuery } from "react-query";

const useNotesNotification = () => {
    // Fetch notes
    const { data } = useQuery(
        ["notesss"],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/get/note`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.notes || [];
        }
    );


    return {
        data,

    };
};

export default useNotesNotification;
