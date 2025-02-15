import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import dayjs from "dayjs"; // For handling date and time

const NotesNotification = () => {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const [filteredNotes, setFilteredNotes] = useState([]);

    // Fetch notes
    const { data } = useQuery(
        ["note"],
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

    // Function to check and filter notes based on current time
    useEffect(() => {
        const checkNotifications = () => {
            const now = dayjs();
            const today = now.format("YYYY-MM-DD");
            const currentHour = now.hour(); // Get current hour

            // Filter notes where date matches today and time matches current hour
            const notifications = (data || []).filter(note => {
                const noteDate = dayjs(note.date).format("YYYY-MM-DD");
                const noteHour = parseInt(note.time, 10); // Convert time string to number

                return noteDate === today && noteHour === currentHour;
            });

            setFilteredNotes(notifications);
        };

        // Check immediately and then every minute
        checkNotifications();
        const interval = setInterval(checkNotifications, 60000);

        return () => clearInterval(interval);
    }, [data]);

    return (
        <div className="flex w-full flex-col gap-6">
            <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300">
                Notes Notifications
                <p className="text-sm font-extralight">
                    Here you would be able to see the notification
                </p>
            </h1>
            <div className="w-full flex flex-col px-14 gap-4">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                        <div key={note._id} className="p-4 border rounded-lg shadow-md bg-white">
                            <p className="text-lg font-semibold">{note.notes}</p>
                            <p className="text-sm text-gray-500">
                                Scheduled at: {dayjs(note.date).format("DD MMM YYYY")} - {note.time}:00
                            </p>
                        </div>
                    ))
                ) : (
                    <h1 className="text-gray-400 font-bold text-xl text-center">
                        No notifications at this time.
                    </h1>

                )}
            </div>
        </div>
    );
};

export default NotesNotification;
