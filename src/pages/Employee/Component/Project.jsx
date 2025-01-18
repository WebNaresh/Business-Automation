import React, { useContext } from 'react';
import { UseContext } from '../../../State/UseState/UseContext';
import axios from 'axios';
import { useQuery } from 'react-query';

export function Project({ empId, organisationId }) {
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const currentDate = new Date();

    // Fetch uploaded document data of the employee
    const { data, isLoading, error } = useQuery(
        ["getProject", empId], // Add empId to the query key to uniquely fetch for each employee
        async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API}/route/project/get/${empId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.projects || []; // Ensure it's an array and projects exist
        }
    );

    const projects = data || []; // Fallback to empty array if no data is returned
    console.log("projects", projects);

    const filteredProjects = projects?.filter((project) => {
        const startDate = new Date(project.start_date); // Use correct field name 'start_date'
        const endDate = project.end_date ? new Date(project.end_date) : null; // Use correct field name 'end_date'

        // Show current and previous projects (i.e., projects that have started and have either ended or are ongoing)
        return startDate <= currentDate && (!endDate || endDate >= currentDate || endDate < currentDate);
    });

    console.log("filteredProjects", filteredProjects);

    if (isLoading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error fetching projects: {error.message}</div>;
    }

    if (filteredProjects.length === 0) {
        return <div>No active or past projects for this employee.</div>;
    }

    return (
        <div className="p-4 bg-white rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Projects</h2>
            <div className="space-y-4">
                {filteredProjects.map((project) => (
                    <div key={project._id} className="border p-4 rounded-md shadow-sm">
                        {/* Dynamically set title based on project status */}
                        <h3 className="font-bold text-blue-500">
                            {project.status === 'Completed' ? 'Previous Project' : 'Current Project'}
                        </h3>
                        <p className="text-gray-700"><strong>Description:</strong> {project.project_description}</p>
                        <p className="text-gray-700"><strong>Role:</strong> {project.project_role}</p>
                        <p className="text-gray-700">
                            <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">
                            <strong>End Date:</strong> {project.end_date ? new Date(project.end_date).toLocaleDateString() : "Ongoing"}
                        </p>
                        <p className="text-gray-700"><strong>Status:</strong> {project.status}</p>
                        <p className="text-gray-700"><strong>Team Size:</strong> {project.team_size}</p>

                        {/* Display team members */}
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-800">Team Members:</h4>
                            {project.team_members?.map((member) => (
                                <p key={member._id} className="text-gray-700">
                                    <strong>{member.name}</strong> - {member.role}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
