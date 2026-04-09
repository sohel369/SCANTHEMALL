import React, { useEffect, useState } from "react";
import { drawsAPI } from "../../api/api";
import DrawModal from "../../components/DrawModal";

export default function DrawsPage() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedDraw, setSelectedDraw] = useState(null);

  useEffect(() => {
    async function fetchDraws() {
      try {
        setLoading(true);
        const data = await drawsAPI.getDraws();
        setDraws(data || []);
      } catch (err) {
        setError(err.message || "Failed to load draws");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDraws();
  }, []);

  const handleCreateDraw = () => {
    setModalMode("create");
    setSelectedDraw(null);
    setModalOpen(true);
  };

  const handleEditDraw = (draw) => {
    setModalMode("edit");
    setSelectedDraw(draw);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        const newDraw = await drawsAPI.createDraw(formData);
        setDraws([newDraw, ...draws]);
        alert("Draw created successfully");
      } else {
        await drawsAPI.updateDraw(selectedDraw.id, formData);
        setDraws(draws.map(d => d.id === selectedDraw.id ? { ...d, ...formData } : d));
        alert("Draw updated successfully");
      }
      setModalOpen(false);
    } catch (err) {
      alert(`Failed to ${modalMode} draw: ${err.message}`);
    }
  };

  const handleDeleteDraw = async (id) => {
    if (!confirm("Are you sure you want to delete this draw? This action cannot be undone.")) return;
    
    try {
      await drawsAPI.deleteDraw(id);
      setDraws(draws.filter(d => d.id !== id));
      alert("Draw deleted successfully");
    } catch (err) {
      alert("Failed to delete draw: " + err.message);
    }
  };

  function exportCSV() {
    if (!draws.length) return alert("No draws to export");
    const keys = ["id", "name", "country", "city", "wave", "next_number"];
    const rows = draws.map(d => keys.reduce((acc, k) => ({ ...acc, [k]: d[k] ?? "" }), {}));
    const csv = [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "draws.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="p-6 text-neutral-50">Loading draws...</div>;
  if (error) return <div className="p-6 text-neutral-50 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 space-y-4 text-neutral-50">
        <h2 className="text-xl font-semibold mb-2">Draws & Entries</h2>
      <div className="flex items-center sm:flex-row-reverse mb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCreateDraw} 
            className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-black font-medium rounded-lg transition-colors"
          >
            + Create Draw
          </button>
          <button 
            onClick={exportCSV} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
          <thead className="text-sm bg-sky-400 rounded-lg shadow-lg">
            <tr>
              <th className="py-3 px-4 text-black font-semibold">ID</th>
              <th className="py-3 px-4 text-black font-semibold">Name</th>
              <th className="py-3 px-4 text-black font-semibold">Country</th>
              <th className="py-3 px-4 text-black font-semibold">City</th>
              <th className="py-3 px-4 text-black font-semibold">Wave</th>
              <th className="py-3 px-4 text-black font-semibold">Next Number</th>
              <th className="py-3 px-4 text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {draws.length === 0 && (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-400 bg-blue-950 rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No draws created yet</p>
                    <p className="text-sm">Create your first sweepstakes draw to get started</p>
                  </div>
                </td>
              </tr>
            )}
            {draws.map(d => (
              <tr key={d.id} className="text-sm bg-blue-950 rounded-lg shadow-lg hover:bg-blue-900 transition-colors">
                <td className="py-4 px-4 font-mono">{d.id}</td>
                <td className="py-4 px-4 font-medium">{d.name}</td>
                <td className="py-4 px-4">{d.country}</td>
                <td className="py-4 px-4">{d.city}</td>
                <td className="py-4 px-4">
                  <span className="bg-blue-600 px-2 py-1 rounded text-xs">{d.wave}</span>
                </td>
                <td className="py-4 px-4 font-mono">{d.next_number || 0}</td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditDraw(d)} 
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDraw(d.id)} 
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Draw Modal */}
      <DrawModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        draw={selectedDraw}
        mode={modalMode}
      />
    </div>
  );
}
