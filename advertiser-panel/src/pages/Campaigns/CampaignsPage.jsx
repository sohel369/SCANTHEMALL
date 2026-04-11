import { useEffect, useState } from "react";
import { campaignsAPI } from "../../api/api";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    region: "",
    start_date: "",
    end_date: "",
    budget: "",
    status: "pending",
  });
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const data = await campaignsAPI.getCampaigns();
        setCampaigns(data || []);
      } catch (err) {
        setError(err.message || "Failed to load campaigns");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function createCampaign(e) {
    e.preventDefault();
    const { title, region, start_date, end_date, budget, status } = form;
    if (!title || !region || !budget || !start_date || !end_date) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const newCampaign = await campaignsAPI.createCampaign({
        title,
        region,
        start_date,
        end_date,
        budget: Number(budget),
        status,
      });
      setCampaigns([newCampaign, ...campaigns]);
      setForm({
        title: "",
        region: "",
        start_date: "",
        end_date: "",
        budget: "",
        status: "pending",
      });
      setShowForm(false);
      alert("Campaign created successfully");
    } catch (err) {
      alert("Failed to create campaign: " + err.message);
    }
  }

  async function toggleStatus(id) {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    const newStatus = campaign.status === "active" ? "paused" : campaign.status === "paused" ? "active" : campaign.status;
    
    try {
      await campaignsAPI.updateCampaign(id, { ...campaign, status: newStatus });
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert("Failed to update campaign: " + err.message);
    }
  }

  async function removeCampaign(id) {
    if (!confirm("Delete this campaign?")) return;
    try {
      await campaignsAPI.deleteCampaign(id);
      setCampaigns(campaigns.filter((c) => c.id !== id));
      alert("Campaign deleted successfully");
    } catch (err) {
      alert("Failed to delete campaign: " + err.message);
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "paused":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const paginatedCampaigns = campaigns.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(campaigns.length / pageSize);

  return (
    <div className="space-y-6 text-neutral-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Campaign Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 text-xs bg-sky-400 rounded-lg"
        >
          + New Campaign
        </button>
      </div>

      {/* Create New Campaign Form */}
      {showForm && (
        <form
          onSubmit={createCampaign}
          className="bg-blue-950 p-4 rounded shadow space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm">Campaign Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400"
                required
              />
            </div>
            <div>
              <label className="text-sm">Target Region</label>
              <input
                type="text"
                name="region"
                value={form.region}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400 placeholder:text-neutral-50"
                placeholder="e.g. California"
                required
              />
            </div>
            <div>
              <label className="text-sm">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400"
                required
              />
            </div>
            <div>
              <label className="text-sm">End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400"
                required
              />
            </div>
            <div>
              <label className="text-sm">Budget (USD)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400"
                required
              />
            </div>
            <div>
              <label className="text-sm">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full p-2 rounded-lg bg-sky-400"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 bg-sky-400 px-4 py-2 rounded-lg"
          >
            Create Campaign
          </button>
        </form>
      )}

      {/* Campaigns Table */}
      <div className="overflow-auto">
        <table className="w-full text-left rounded-lg shadow-lg border-separate border-spacing-y-2">
          <thead className="text-xs bg-sky-400 rounded-lg shadow-lg">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">Budget</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Impr.</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Conv. Rate</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.map((c) => {
              const convRate =
                (c.impressions || 0) > 0
                  ? (((c.clicks || 0) / (c.impressions || 1)) * 100).toFixed(2) + "%"
                  : "0.00%";
              return (
                <tr key={c.id} className="text-xs bg-blue-950 rounded-lg shadow-lg">
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">{c.region || "-"}</td>
                  <td className="p-3">${(c.budget || 0).toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className="px-2 py-1 rounded-lg text-xs bg-sky-400"
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">{c.impressions || 0}</td>
                  <td className="p-3">{c.clicks || 0}</td>
                  <td className="p-3">{convRate}</td>
                  <td className="p-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className="px-2 py-1 rounded-lg text-xs bg-sky-400"
                    >
                      {c.status === "active"
                        ? "Pause"
                        : c.status === "paused"
                          ? "Resume"
                          : "Toggle"}
                    </button>
                    <button
                      onClick={() => removeCampaign(c.id)}
                      className="px-2 py-1 rounded-lg text-xs bg-sky-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-gray-500 text-center">
                  No campaigns yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-sky-400 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-sky-400 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
