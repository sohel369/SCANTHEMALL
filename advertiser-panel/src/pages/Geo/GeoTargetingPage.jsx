import { useEffect, useState } from "react";
import { billboardsAPI } from "../../api/api";

export default function GeoTargetingPage() {
    const [zones, setZones] = useState([]);
    const [exclude, setExclude] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [zip, setZip] = useState("");
    const [previewRegion, setPreviewRegion] = useState(null);

    useEffect(() => {
        async function fetchBillboards() {
          try {
            const data = await billboardsAPI.getBillboards();
            // Extract unique postal codes and regions from billboards
            const postalCodes = [...new Set(data.map(b => b.postal_code).filter(Boolean))];
            setZones(postalCodes.map(pc => ({ 
              id: `z_${pc}`,
              name: pc, 
              zips: [pc],
              estimatedReach: Math.floor(20000 + Math.random() * 50000)
            })));
            if (data.length > 0) {
              setPreviewRegion({ 
                name: data[0].postal_code, 
                zips: [data[0].postal_code],
                estimatedReach: Math.floor(20000 + Math.random() * 50000)
              });
            }
          } catch (err) {
            console.error("Failed to load billboards:", err);
          }
        }
        fetchBillboards();
    }, []);

    function addZone() {
        if (!selectedRegion && !zip) return alert("Select a region or enter ZIP.");
        const name = selectedRegion || `Custom Zone (${zip})`;
        const z = {
            id: `z_${Date.now()}`,
            name,
            zips: zip ? [zip] : [],
            estimatedReach: Math.floor(20000 + Math.random() * 50000),
        };
        const next = [z, ...zones];
        setZones(next);
        // TODO: Save to backend API
        setZip("");
        setSelectedRegion("");
    }

    function excludeZip() {
        if (!zip) return alert("Enter ZIP to exclude");
        if (exclude.includes(zip)) return alert("ZIP already excluded");
        const next = [...exclude, zip];
        setExclude(next);
        // TODO: Save exclusions to backend API
        alert("Exclusions feature not yet implemented in backend");
        setZip("");
    }

    function removeZone(id) {
        if (!confirm("Remove this target zone?")) return;
        const next = zones.filter(z => z.id !== id);
        setZones(next);
        // TODO: Remove from backend API
    }

    function previewZone(zone) {
        setPreviewRegion(zone);
    }

    return (
        <div className="space-y-6 text-neutral-50">
            <h2 className="text-xl font-semibold">Geo Targeting</h2>

            {/* Add new targeting zone */}
            <div className="bg-blue-950 p-4 rounded-lg shadow-lg">
                <h3 className="font-medium mb-2">Create Targeting Zone</h3>
                <div className="flex flex-wrap gap-3 items-center">
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-sky-400"
                    >
                        <option value="">Select Region</option>
                        {regions.map((r, i) => (
                            <option key={i} value={r}>{r}</option>
                        ))}
                    </select>

                    <input
                        className="px-2 py-1 rounded-lg bg-sky-400 placeholder:text-neutral-50"
                        placeholder="or Enter ZIP/postcode"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                    />

                    <button
                        onClick={addZone}
                        className="px-3 py-1 bg-sky-400 rounded-lg"
                    >
                        + Add Target Zone
                    </button>

                    <button
                        onClick={excludeZip}
                        className="px-3 py-1 rounded-lg bg-sky-400"
                    >
                        Exclude ZIP
                    </button>
                </div>

                <div className="text-xs mt-2">
                    Tip: Use ZIP codes for precise targeting, or pick a region for broad coverage.
                </div>
            </div>

            {/* Targeting zones */}
            <div>
                <h3 className="font-medium mb-2">Active Target Zones</h3>
                {zones.length === 0 ? (
                    <div className="text-gray-500 text-sm">No zones added yet.</div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {zones.map(z => (
                            <div
                                key={z.id}
                                className="bg-blue-950 text-xs rounded-lg p-3 shadow-lg"
                            >
                                <div className="text-sm font-medium mb-2">{z.name}</div>
                                <div>
                                    ZIPs: {(z.zips || []).join(", ") || "N/A"}
                                </div>
                                <div className="text-xs mt-1">
                                    Estimated Reach: {(z.estimatedReach || 0).toLocaleString()}
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => previewZone(z)}
                                        className="px-2 py-2 rounded-lg bg-sky-400"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => removeZone(z.id)}
                                        className="px-2 py-2 rounded-lg bg-sky-400"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Exclusions */}
            <div>
                <h3 className="font-medium mb-2">Excluded ZIPs</h3>
                <div className="flex flex-wrap gap-2">
                    {exclude.length > 0 ? (
                        exclude.map((z, i) => (
                            <div key={i} className="px-2 py-2 bg-sky-400 rounded-lg text-xs">
                                {z}
                            </div>
                        ))
                    ) : (
                        <div className="text-xs">No exclusions yet.</div>
                    )}
                </div>
            </div>

            {/* Map preview placeholder */}
            {previewRegion && (
                <div className="bg-blue-950 p-4 rounded shadow mt-6 text-xs">
                    <h3 className="text-sm font-semibold mb-2">Dynamic Map Preview</h3>
                    <div className="mb-3">
                        Showing approximate reach area for {previewRegion.name}.
                    </div>
                    <div className="w-full h-64 bg-sky-400 rounded flex items-center justify-center">
                        🗺️ Map preview for <b>{previewRegion.name}</b> (heatmap placeholder)
                    </div>
                </div>
            )}
        </div>
    );
}
