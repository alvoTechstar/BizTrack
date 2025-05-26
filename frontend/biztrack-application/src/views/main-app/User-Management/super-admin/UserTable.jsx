import React from "react";
import { Edit, Block, CheckCircle } from "@mui/icons-material";

const UserTable = ({ users, onEdit, onToggleStatus }) => {
  return (
    <table className="min-w-full border border-gray-300 rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border-b border-gray-300 text-left">Username</th>
          <th className="p-2 border-b border-gray-300 text-left">Full Name</th>
          <th className="p-2 border-b border-gray-300 text-left">Email</th>
          <th className="p-2 border-b border-gray-300 text-left">Phone</th>
          <th className="p-2 border-b border-gray-300 text-left">Role</th>
          <th className="p-2 border-b border-gray-300 text-left">Business</th>
          <th className="p-2 border-b border-gray-300 text-left">Status</th>
          <th className="p-2 border-b border-gray-300 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && (
          <tr>
            <td colSpan={8} className="text-center p-4">
              No users found.
            </td>
          </tr>
        )}
        {users.map((user) => (
          <tr
            key={user.id}
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            <td className="p-2">{user.username}</td>
            <td className="p-2">{user.fullName}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">{user.phone}</td>
            <td className="p-2">{user.role}</td>
            <td className="p-2">{user.business}</td>
            <td className="p-2">{user.status}</td>
            <td className="p-2 flex justify-center space-x-2">
              <button
                onClick={() => onEdit(user)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit User"
              >
                <Edit />
              </button>
              <button
                onClick={() => onToggleStatus(user.id)}
                className={`${
                  user.status === "Active"
                    ? "text-green-600 hover:text-green-800"
                    : "text-red-600 hover:text-red-800"
                }`}
                title={
                  user.status === "Active"
                    ? "Block User"
                    : user.status === "Blocked"
                    ? "Disable User"
                    : "Activate User"
                }
              >
                {user.status === "Active" ? <Block /> : <CheckCircle />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
