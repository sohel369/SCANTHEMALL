import React, { useEffect, useMemo, useState } from "react";
import { usersAPI } from "../../api/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // Filter by role
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 10;

  // Fetch users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await usersAPI.getUsers();
        setUsers(data || []);
      } catch (err) {
        setError(err.message || "Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filtered users based on search query and role filter
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return users.filter(u => {
      const matchesQuery = !qq || (u.email + u.role).toLowerCase().includes(qq);
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, q, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // --- User Management Functions ---

  async function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const role = prompt("Edit Role (admin/advertiser/user):", user.role) || user.role;
    if (role === user.role) return;
    
    try {
      await usersAPI.updateUserRole(id, role);
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      alert("User role updated successfully");
    } catch (err) {
      alert("Failed to update user role: " + err.message);
    }
  }

  function resetPassword(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    alert("Password reset functionality not yet implemented in backend");
  }

  async function remove(id) {
    if (!confirm("Delete user?")) return;
    try {
      await usersAPI.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
  }

  if (loading) return <div className="p-6 text-neutral-50">Loading users...</div>;
  if (error) return <div className="p-6 text-neutral-50 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 text-neutral-50">
      {/* Header with search and filters */}
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="flex sm:flex-row-reverse items-center mb-4">
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users"
            className="px-2 py-1 rounded-lg placeholder:text-neutral-50 w-full bg-blue-950"
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-2 py-1 bg-sky-400 rounded-lg">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="advertiser">Advertiser</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-auto">
        <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
          <thead className="text-sm bg-sky-400 rounded-lg shadow-lg">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(u => (
              <tr key={u.id} className="text-xs bg-blue-950 rounded-lg shadow-lg hover:bg-sky-400">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 space-x-1">
                  <button onClick={() => editUser(u.id)}>Edit Role</button>
                  <button onClick={() => resetPassword(u.id)}>Reset Password</button>
                  <button onClick={() => remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && <tr><td colSpan="5" className="p-4 text-gray-500">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>Page {page} / {pageCount}</div>
        <div className="space-x-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-sky-400 rounded-lg">Prev</button>
          <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} className="px-3 py-1 bg-sky-400 rounded-lg">Next</button>
        </div>
      </div>
    </div>
  );
}
