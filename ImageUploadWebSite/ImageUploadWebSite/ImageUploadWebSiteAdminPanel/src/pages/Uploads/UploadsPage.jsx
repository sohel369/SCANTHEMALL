import React, { useEffect, useState } from "react";
import { uploadsAPI } from "../../api/api";

export default function UploadsPage() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUploads() {
      try {
        setLoading(true);
        const data = await uploadsAPI.getUploads();
        setUploads(data || []);
      } catch (err) {
        setError(err.message || "Failed to load uploads");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUploads();
  }, []);

  async function remove(id) {
    if (!confirm("Delete upload?")) return;
    try {
      await uploadsAPI.deleteUpload(id);
      setUploads(uploads.filter((u) => u.id !== id));
      alert("Upload deleted successfully");
    } catch (err) {
      alert("Failed to delete upload: " + err.message);
    }
  }

  function exportCSV() {
    if (!uploads.length) return alert("No uploads to export");
    const keys = ["id", "user_id", "filename", "platform", "created_at"];
    const rows = uploads.map((r) =>
      keys.reduce((acc, k) => ({ ...acc, [k]: r[k] ?? "" }), {})
    );
    const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uploads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportExcel() {
    if (!uploads.length) return alert("No uploads to export");
    const keys = ["id", "user_id", "filename", "platform", "created_at"];
    const rows = uploads.map((r) =>
      keys.reduce((acc, k) => ({ ...acc, [k]: r[k] ?? "" }), {})
    );
    const csvContent = [keys.join(","), ...rows.map(r => keys.map(k => r[k]).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uploads.xls";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-6 text-neutral-50">Loading uploads...</div>;
  if (error) return <div className="p-6 text-neutral-50 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-4 text-neutral-50">
      <h2 className="text-xl font-semibold mb-2">Image Uploads</h2>
      <div className="flex items-center sm:flex-row-reverse mb-2">
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-1 bg-sky-400 rounded-lg">Export CSV</button>
          <button onClick={exportExcel} className="px-3 py-1 bg-sky-400 rounded-lg">Export Excel</button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
          <thead className="text-sm bg-sky-400 rounded-lg shadow-lg">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Filename</th>
              <th className="p-3">Platform/Tag</th>
              <th className="p-3">Uploaded At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map(u => {
              const isAdvertiser = u.upload_type === 'advertiser';
              const fileUrl = isAdvertiser
                ? `/uploads/advertiser-media/${u.filename}`
                : `/uploads/${u.filename}`;

              return (
                <tr key={u.id} className="text-xs bg-blue-950 rounded-lg shadow-lg">
                  <td className="py-3 px-1">{u.id}</td>
                  <td className="py-3 px-1">{u.user_id}</td>
                  <td className="py-3 px-1">
                    <span className={`px-2 py-1 rounded text-xs ${isAdvertiser ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                      {isAdvertiser ? 'Advertiser' : 'User'}
                    </span>
                  </td>
                  <td className="py-3 px-1">
                    {u.filename && (
                      <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                        {u.filename}
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-1">{u.platform || "-"}</td>
                  <td className="py-3 px-1">{new Date(u.created_at).toLocaleString()}</td>
                  <td className="py-3 px-1 space-x-1">
                    <button onClick={() => remove(u.id)} className="p-2 bg-sky-400 rounded-lg">Delete</button>
                  </td>
                </tr>
              );
            })}
            {uploads.length === 0 && <tr><td colSpan="6" className="p-4 text-gray-500">No uploads found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
