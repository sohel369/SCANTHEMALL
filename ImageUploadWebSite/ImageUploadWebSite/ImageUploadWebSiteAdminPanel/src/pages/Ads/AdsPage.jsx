import React, { useEffect, useState } from "react";
import { adsAPI } from "../../api/api";

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [newAd, setNewAd] = useState({
    title: "",
    image_path: "",
    link: "",
    platform: "Facebook",
    placement: "leaderboard",
    region: "Global",
    active: true,
  });

  const adSlots = ["leaderboard", "skyscraper", "rectangle"];
  const platforms = ["Facebook", "Google", "Instagram", "Twitter", "LinkedIn", "TikTok"];
  const regions = ["Global", "North America", "Europe", "Asia", "South America", "Africa", "Oceania"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAds() {
      try {
        setLoading(true);
        const data = await adsAPI.getAds();
        setAds(data || []);
      } catch (err) {
        setError(err.message || "Failed to load ads");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  function openModal(ad = null) {
    setFormErrors({});
    if (ad) {
      setNewAd({
        id: ad.id,
        title: ad.title || "",
        image_path: ad.image_path || "",
        link: ad.link || "",
        platform: ad.platform || "Facebook",
        placement: ad.placement || "leaderboard",
        region: ad.region || "Global",
        active: ad.active !== undefined ? ad.active : true,
      });
    } else {
      setNewAd({
        title: "",
        image_path: "",
        link: "",
        platform: "Facebook",
        placement: "leaderboard",
        region: "Global",
        active: true,
      });
    }
    setShowModal(true);
  }

  function validateForm() {
    const errors = {};
    
    if (!newAd.title?.trim()) {
      errors.title = "Title is required";
    }
    
    if (!newAd.image_path?.trim()) {
      errors.image_path = "Image URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(newAd.image_path);
      } catch {
        errors.image_path = "Please enter a valid URL";
      }
    }
    
    if (!newAd.link?.trim()) {
      errors.link = "Link URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(newAd.link);
      } catch {
        errors.link = "Please enter a valid URL";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function saveAd() {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const adData = {
        title: newAd.title.trim(),
        image_path: newAd.image_path.trim(),
        link: newAd.link.trim(),
        platform: newAd.platform,
        placement: newAd.placement,
        region: newAd.region,
        active: newAd.active,
      };

      if (newAd.id) {
        const updated = await adsAPI.updateAd(newAd.id, adData);
        setAds(ads.map(a => a.id === newAd.id ? { ...a, ...updated } : a));
      } else {
        const created = await adsAPI.createAd(adData);
        setAds([created, ...ads]);
      }
      
      setShowModal(false);
      setNewAd({
        title: "",
        image_path: "",
        link: "",
        platform: "Facebook",
        placement: "leaderboard",
        region: "Global",
        active: true,
      });
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save ad" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id) {
    const ad = ads.find(a => a.id === id);
    if (!ad) return;
    try {
      const updated = await adsAPI.updateAd(id, { ...ad, active: !ad.active });
      setAds(ads.map(a => a.id === id ? { ...a, active: !a.active } : a));
    } catch (err) {
      setError("Failed to update ad: " + err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this ad? This action cannot be undone.")) return;
    try {
      await adsAPI.deleteAd(id);
      setAds(ads.filter(a => a.id !== id));
    } catch (err) {
      setError("Failed to delete ad: " + err.message);
      setTimeout(() => setError(""), 5000);
    }
  }

  const filteredAds = ads.filter(a =>
    (!regionFilter || a.region === regionFilter) &&
    (!slotFilter || a.placement === slotFilter)
  );

  if (loading) return (
    <div className="p-6 text-neutral-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
      <span className="ml-2">Loading ads...</span>
    </div>
  );
  
  if (error) return (
    <div className="p-6 text-neutral-50">
      <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4 text-neutral-50">
      {/* Header */}
      <h2 className="text-2xl font-bold text-neutral-50 mb-4">Advertisement Management</h2>
      <div className="flex flex-row-reverse items-center justify-between mb-6">
        <button 
          onClick={() => openModal()} 
          className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Advertisement
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-300">Region:</label>
          <select 
            value={regionFilter} 
            onChange={e => setRegionFilter(e.target.value)} 
            className="px-3 py-2 bg-slate-700 text-neutral-200 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Regions</option>
            {[...new Set(ads.map(a => a.region))].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-300">Placement:</label>
          <select 
            value={slotFilter} 
            onChange={e => setSlotFilter(e.target.value)} 
            className="px-3 py-2 bg-slate-700 text-neutral-200 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Placements</option>
            {adSlots.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        {(regionFilter || slotFilter) && (
          <button
            onClick={() => {
              setRegionFilter("");
              setSlotFilter("");
            }}
            className="px-3 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Ads Table */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Platform</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Placement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Region</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Link</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-neutral-400">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-neutral-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p>No advertisements found</p>
                      <p className="text-sm text-neutral-500">Create your first ad to get started</p>
                    </div>
                  </td>
                </tr>
              )}
              {filteredAds.map(ad => (
                <tr key={ad.id} className="hover:bg-slate-750 transition-colors">
                  <td className="px-4 py-4 text-sm text-neutral-200 font-medium">{ad.title}</td>
                  <td className="px-4 py-4 text-sm text-neutral-300">{ad.platform || "-"}</td>
                  <td className="px-4 py-4 text-sm text-neutral-300">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-900 text-sky-200">
                      {ad.placement}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-300">{ad.region}</td>
                  <td className="px-4 py-4 text-sm">
                    {ad.image_path ? (
                      <a 
                        href={ad.image_path} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sky-400 hover:text-sky-300 underline transition-colors"
                      >
                        View Image
                      </a>
                    ) : (
                      <span className="text-neutral-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {ad.link ? (
                      <a 
                        href={ad.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sky-400 hover:text-sky-300 underline transition-colors"
                      >
                        Visit Link
                      </a>
                    ) : (
                      <span className="text-neutral-500">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ad.active 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openModal(ad)} 
                        className="px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded transition-colors"
                        title="Edit ad"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleActive(ad.id)} 
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          ad.active 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        title={ad.active ? 'Deactivate ad' : 'Activate ad'}
                      >
                        {ad.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => remove(ad.id)} 
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="Delete ad"
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
      </div>

      {/* Professional Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-neutral-100">
                {newAd.id ? "Edit Advertisement" : "Create New Advertisement"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors"
                disabled={saving}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Error Message */}
              {formErrors.submit && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md">
                  {formErrors.submit}
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter ad title"
                  value={newAd.title}
                  onChange={e => setNewAd({...newAd, title: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-700 text-neutral-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-400 ${
                    formErrors.title ? 'border-red-500 bg-red-900/20' : 'border-slate-600'
                  }`}
                  disabled={saving}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.title}</p>
                )}
              </div>

              {/* Platform Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Platform <span className="text-red-400">*</span>
                </label>
                <select
                  value={newAd.platform}
                  onChange={e => setNewAd({...newAd, platform: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-neutral-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={saving}
                >
                  {platforms.map(platform => (
                    <option key={platform} value={platform} className="bg-slate-700 text-neutral-100">{platform}</option>
                  ))}
                </select>
              </div>

              {/* Placement Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Placement <span className="text-red-400">*</span>
                </label>
                <select
                  value={newAd.placement}
                  onChange={e => setNewAd({...newAd, placement: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-neutral-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={saving}
                >
                  {adSlots.map(slot => (
                    <option key={slot} value={slot} className="bg-slate-700 text-neutral-100">
                      {slot.charAt(0).toUpperCase() + slot.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Region <span className="text-red-400">*</span>
                </label>
                <select
                  value={newAd.region}
                  onChange={e => setNewAd({...newAd, region: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700 text-neutral-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  disabled={saving}
                >
                  {regions.map(region => (
                    <option key={region} value={region} className="bg-slate-700 text-neutral-100">{region}</option>
                  ))}
                </select>
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Image URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newAd.image_path}
                  onChange={e => setNewAd({...newAd, image_path: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-700 text-neutral-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-400 ${
                    formErrors.image_path ? 'border-red-500 bg-red-900/20' : 'border-slate-600'
                  }`}
                  disabled={saving}
                />
                {formErrors.image_path && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.image_path}</p>
                )}
              </div>

              {/* Link URL Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-1">
                  Link URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={newAd.link}
                  onChange={e => setNewAd({...newAd, link: e.target.value})}
                  className={`w-full px-3 py-2 bg-slate-700 text-neutral-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-400 ${
                    formErrors.link ? 'border-red-500 bg-red-900/20' : 'border-slate-600'
                  }`}
                  disabled={saving}
                />
                {formErrors.link && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.link}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={newAd.active}
                  onChange={e => setNewAd({...newAd, active: e.target.checked})}
                  className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-600 rounded bg-slate-700"
                  disabled={saving}
                />
                <label htmlFor="active" className="ml-2 block text-sm text-neutral-200">
                  Active (ad will be displayed)
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700 bg-slate-750">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-neutral-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={saveAd}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {saving && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {saving ? 'Saving...' : (newAd.id ? 'Update Ad' : 'Create Ad')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
