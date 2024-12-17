// DocList.js
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const DocList = ({ data, onEdit, onDelete }) => {
  const handleEdit = (id) => {
    onEdit(id);
  };
  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <div className="w-full">
      <div className="w-full"></div>
      <table className="min-w-full bg-white text-left !text-sm font-light">
        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
          <tr className="!font-semibold">
            <th scope="col" className="!text-left pl-8 py-3 w-1/3">
              Sr. No
            </th>
            <th scope="col" className="py-3 w-1/3">
              title
            </th>
            <th scope="col" className="py-3 w-1/3 !text-right pr-8">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr className="!font-medium border-b" key={idx}>
              <td className="!text-left pl-9 w-1/3">{idx + 1}</td>
              <td className="py-3 text-left w-1/3">{item.title}</td>
              <td className="text-right pr-4 w-1/3">
                <IconButton
                  color="primary"
                  aria-label="edit"
                  onClick={() => handleEdit(item._id)}
                >
                  <EditOutlined />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                  aria-label="delete"
                >
                  <DeleteOutline />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocList;
