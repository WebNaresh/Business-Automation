import React from 'react';

export function Activity({ userId }) {
  // Temporary data for activities
  const activities = [
    {
      userId: "64a8a2c7f30e9c001d7f71a2",
      apiEndpoint: "/api/employees/12345",
      httpMethod: "POST",
      requestBody: { name: "John Doe", department: "HR" },
      requestParams: { id: "12345" },
      requestQuery: { filter: "active" },
      statusCode: 201,
      responseMessage: "Employee added successfully.",
      timestamp: "2025-01-17T14:30:00Z",
    },
    {
      userId: "64a8a2c7f30e9c001d7f71a2",
      apiEndpoint: "/api/employees/12345",
      httpMethod: "PUT",
      requestBody: { name: "John Doe", department: "Finance" },
      requestParams: { id: "12345" },
      requestQuery: { filter: "active" },
      statusCode: 200,
      responseMessage: "Employee updated successfully.",
      timestamp: "2025-01-16T10:15:00Z",
    },
    {
      userId: "64a8a2c7f30e9c001d7f71a2",
      apiEndpoint: "/api/employees/12345",
      httpMethod: "DELETE",
      requestBody: null,
      requestParams: { id: "12345" },
      requestQuery: {},
      statusCode: 204,
      responseMessage: "Employee deleted successfully.",
      timestamp: "2025-01-15T12:00:00Z",
    },
  ];

  // Filter activities by userId if provided
  //const filteredActivities = activities.filter((activity) => activity.userId === userId);

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-lg font-bold mb-4">Activity Logs for User ID: {userId}</h2>
      <div>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="border-b pb-4 mb-4 last:border-none last:pb-0"
            >
              <p className="text-gray-700">
                <strong>API Endpoint:</strong> {activity.apiEndpoint}
              </p>
              <p className="text-gray-700">
                <strong>HTTP Method:</strong> {activity.httpMethod}
              </p>
              <p className="text-gray-700">
                <strong>Request Body:</strong>{" "}
                {activity.requestBody ? JSON.stringify(activity.requestBody) : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Request Params:</strong>{" "}
                {activity.requestParams ? JSON.stringify(activity.requestParams) : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Request Query:</strong>{" "}
                {activity.requestQuery ? JSON.stringify(activity.requestQuery) : "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Status Code:</strong> {activity.statusCode}
              </p>
              <p className="text-gray-700">
                <strong>Response Message:</strong> {activity.responseMessage}
              </p>
              <p className="text-gray-700">
                <strong>Timestamp:</strong>{" "}
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No activity logs found for this user.</p>
        )}
      </div>
    </div>
  );
}
