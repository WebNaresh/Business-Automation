import React, { useContext, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useQuery } from "react-query";
import AddNote from "./AddNote";
import UpdateNotes from "./UpdateNotes";

export function Note({ empId, organisationId }) {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Modal states and function
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    // Fetch notes
    const { data, isLoading, error } = useQuery(
        ["getNote", empId],
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/note/get/${empId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.notes || [];
        }
    );

    const notes = data || [];

    if (isLoading) {
        return <div>Loading notes...</div>;
    }

    if (error) {
        return <div>Error fetching notes: {error.message}</div>;
    }

    // Handlers
    const handleAddNote = () => {
        setOpen(true);
    };

    const handleEditNote = (note) => {
        setEditMode(true);
        setSelectedNote(note);
    };

    const handleEditClose = () => {
        setEditMode(false);
        setSelectedNote(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Notes</h2>
                <button
                    onClick={handleAddNote}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add Note
                </button>
            </div>
            <div className="space-y-4">
                {notes && notes.map((note, id) => (
                    <div key={note._id} className="bg-gray-50 p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-800">Note</span>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleEditNote(note)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-700">{note.notes}</p>
                    </div>
                ))}
            </div>
            <AddNote
                empId={empId}
                organisationId={organisationId}
                open={open}
                handleClose={() => setOpen(false)}
            />
            <UpdateNotes
                note={selectedNote}
                organisationId={organisationId}
                open={editMode}
                handleClose={handleEditClose}
            />
        </div>

    );
}

