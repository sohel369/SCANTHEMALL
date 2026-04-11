import { useEffect, useState } from "react";
import { pagesAPI } from "../../api/api";

export default function PolicyPage() {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", content: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchPages() {
            try {
                setLoading(true);
                const data = await pagesAPI.getPages();
                setPolicies(data || []);
            } catch (err) {
                setError(err.message || "Failed to load pages");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPages();
    }, []);

    function openEditor(policy) {
        setEditingPolicy(policy);
        setEditForm({
            title: policy.title,
            content: policy.content
        });
    }

    function closeEditor() {
        setEditingPolicy(null);
        setEditForm({ title: "", content: "" });
    }

    async function saveContent() {
        if (!editingPolicy) return;

        try {
            setSaving(true);
            await pagesAPI.updatePage(editingPolicy.slug, {
                title: editForm.title,
                content: editForm.content
            });
            setPolicies(policies.map(p =>
                p.slug === editingPolicy.slug
                    ? { ...p, title: editForm.title, content: editForm.content }
                    : p
            ));
            closeEditor();
        } catch (err) {
            setError("Failed to update page: " + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="p-6 text-neutral-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
            <span className="ml-2">Loading pages...</span>
        </div>
    );

    if (error && !editingPolicy) return (
        <div className="p-6 text-neutral-50">
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
            </div>
        </div>
    );

    return (
        <>
            <div className="p-6 space-y-4 text-neutral-50">
                <h2 className="text-2xl font-bold">Policy & Static Content Management</h2>

                <div className="grid gap-4">
                    {policies.map((policy) => (
                        <div key={policy.slug} className="bg-slate-800 rounded-lg shadow-lg p-6">
                            <div className="block sm:flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-sky-400 mb-2">{policy.title}</h3>
                                </div>
                                <button
                                    onClick={() => openEditor(policy)}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mb-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit Content
                                </button>
                            </div>
                            <div className="text-sm text-neutral-400 mb-2">
                                Slug: <span className="font-mono text-neutral-300">{policy.slug}</span>
                            </div>
                            <div className="text-sm text-neutral-400 mb-2">
                                Last updated: {new Date(policy.updated_at).toLocaleString()}
                            </div>

                            <div className="bg-slate-900 rounded-lg p-4 max-h-40 overflow-y-auto w-60 sm:w-full">
                                <p className="text-sm text-neutral-300 whitespace-pre-wrap">{policy.content}</p>
                            </div>
                        </div>
                    ))}
                </div>  
            </div>

            {/* Professional Editor Modal */}
            {editingPolicy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-700">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-700">
                            <div>
                                <h3 className="text-xl font-semibold text-neutral-100">
                                    Edit Page Content
                                </h3>
                                <p className="text-sm text-neutral-400 mt-1">
                                    Slug: <span className="font-mono">{editingPolicy.slug}</span>
                                </p>
                            </div>
                            <button
                                onClick={closeEditor}
                                className="text-neutral-400 hover:text-neutral-200 transition-colors"
                                disabled={saving}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {error && (
                                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}

                            {/* Title Field */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-200 mb-2">
                                    Page Title
                                </label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-400"
                                    placeholder="Enter page title"
                                    disabled={saving}
                                />
                            </div>

                            {/* Content Field */}
                            <div className="flex-1 flex flex-col">
                                <label className="block text-sm font-medium text-neutral-200 mb-2">
                                    Page Content
                                </label>
                                <textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                                    className="flex-1 min-h-[400px] px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-neutral-400 font-mono text-sm resize-none"
                                    placeholder="Enter page content (HTML supported)"
                                    disabled={saving}
                                />
                                <p className="text-xs text-neutral-400 mt-2">
                                    Tip: You can use HTML tags for formatting (e.g., &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.)
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-750">
                            <div className="text-sm text-neutral-400">
                                {editForm.content.length} characters
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={closeEditor}
                                    className="px-4 py-2 text-sm font-medium text-neutral-300 bg-slate-700 border border-slate-600 rounded-md hover:bg-slate-600 hover:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveContent}
                                    disabled={saving || !editForm.title.trim() || !editForm.content.trim()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {saving && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
