import { useEffect, useState } from "react";
import { getData, saveData, recordAudit } from "../../api/mockApi";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    uploadLimitPerDay: 20,
    adRotationSeconds: 60,
    enableMultiLang: false,
    emailFrom: "no-reply@gottascan.com",
    drawThreshold: 100,
    apiKey: "super-secret-key",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const currentUserRole = "super-admin";

  useEffect(() => {
    getData("settings").then((d) => {
      if (d && Object.keys(d).length) setSettings(d);
    });
  }, []);

  async function save() {
    setSaving(true);
    await saveData("settings", settings);
    recordAudit("update_settings", JSON.stringify(settings));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const tabs = [
    { id: 'general', label: 'General', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { id: 'email', label: 'Email', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'advanced', label: 'Advanced', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )},
  ];

  return (
    <div className="p-6 space-y-6 text-neutral-50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-sm text-neutral-400 mt-1">Manage your platform configuration and preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-400 bg-green-900 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved successfully
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-sky-400 border-b-2 border-sky-400'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Upload Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Daily Upload Limit
                </label>
                <input
                  type="number"
                  value={settings.uploadLimitPerDay}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, uploadLimitPerDay: Number(e.target.value) }))
                  }
                  className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-neutral-400 mt-1">Maximum uploads per user per day</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Draw Entry Threshold
                </label>
                <input
                  type="number"
                  value={settings.drawThreshold}
                  onChange={(e) => setSettings((s) => ({ ...s, drawThreshold: Number(e.target.value) }))}
                  className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <p className="text-xs text-neutral-400 mt-1">Minimum entries required for draw</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Advertisement Settings</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Ad Rotation Interval (seconds)
              </label>
              <input
                type="number"
                value={settings.adRotationSeconds}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, adRotationSeconds: Number(e.target.value) }))
                }
                className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <p className="text-xs text-neutral-400 mt-1">How often ads rotate on the platform</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Localization</h3>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-neutral-200">
                  Enable Multi-Language Support
                </label>
                <p className="text-xs text-neutral-400 mt-1">Allow users to select their preferred language</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableMultiLang}
                  onChange={(e) => setSettings((s) => ({ ...s, enableMultiLang: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                From Email Address
              </label>
              <input
                type="email"
                value={settings.emailFrom}
                onChange={(e) => setSettings((s) => ({ ...s, emailFrom: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="no-reply@example.com"
              />
              <p className="text-xs text-neutral-400 mt-1">Email address used for outgoing system emails</p>
            </div>
          </div>

          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-blue-200">SMTP Configuration Required</p>
                <p className="text-blue-300 mt-1">Configure SMTP settings in your .env file to enable email functionality.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {currentUserRole === "super-admin" ? (
            <>
              <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  API Key (Super Admin Only)
                </h3>
                <div>
                  <label className="block text-sm font-medium text-neutral-200 mb-2">
                    Platform API Key
                  </label>
                  <input
                    type="text"
                    value={settings.apiKey}
                    onChange={(e) => setSettings((s) => ({ ...s, apiKey: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700 text-neutral-100 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                  <p className="text-xs text-neutral-400 mt-1">Used for API authentication and integrations</p>
                </div>
              </div>

              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-yellow-200">Warning</p>
                    <p className="text-yellow-300 mt-1">These settings are for advanced users only. Incorrect configuration may affect platform functionality.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-800 rounded-lg shadow-lg p-12 border border-slate-700 text-center">
              <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="text-lg font-semibold text-neutral-300 mb-2">Super Admin Access Required</h3>
              <p className="text-neutral-400">Advanced settings are only available to super administrators.</p>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-700">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-neutral-300 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
        >
          Reset Changes
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
