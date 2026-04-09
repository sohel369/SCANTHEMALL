import { useEffect, useState } from "react";
import { accountAPI } from "../../api/api";

export default function AccountPage() {
  const [account, setAccount] = useState({
    company: "Acme Corp",
    contact: "marketing@acme.com",
    billingEmail: "billing@acme.com",
    apiKey: "demo-123456",
    notifyEmail: true,
    notifySMS: false,
    twoFA: false,
  });

  useEffect(() => {
    async function fetchAccount() {
      try {
        const data = await accountAPI.getAccount();
        if (data) {
          setAccount({
            company: data.company || "",
            contact: data.email || "",
            billingEmail: data.email || "",
            apiKey: "demo-123456", // This would come from backend
            notifyEmail: true,
            notifySMS: false,
            twoFA: false,
          });
        }
      } catch (err) {
        console.error("Failed to load account:", err);
      }
    }
    fetchAccount();
  }, []);

  async function save() {
    try {
      await accountAPI.updateAccount({
        email: account.contact,
        company: account.company,
      });
      alert("Account settings saved!");
    } catch (err) {
      alert("Failed to update account: " + err.message);
    }
  }

  function resetPassword() {
    alert("Password reset link sent to your contact email!");
  }

  return (
    <div className="bg-blue-950 p-6 rounded-lg shadow-lg space-y-6 text-neutral-50">
      <h2 className="text-xl font-semibold">Account Settings</h2>

      {/* Company & Contact Info */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block mb-1">Company Name</label>
          <input
            value={account.company}
            onChange={e => setAccount(a => ({ ...a, company: e.target.value }))}
            className="bg-sky-400 px-2 py-1 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Contact Email</label>
          <input
            value={account.contact}
            onChange={e => setAccount(a => ({ ...a, contact: e.target.value }))}
            className="px-2 py-1 rounded-lg bg-sky-400 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Billing Email</label>
          <input
            value={account.billingEmail}
            onChange={e => setAccount(a => ({ ...a, billingEmail: e.target.value }))}
            className="px-2 py-1 rounded-lg bg-sky-400 w-full"
          />
        </div>
      </div>

      {/* API Key / Tracking Pixel */}
      <div className="space-y-2 text-xs">
        <label className="block mb-1">API Key / Tracking Pixel</label>
        <input
          value={account.apiKey}
          onChange={e => setAccount(a => ({ ...a, apiKey: e.target.value }))}
          className="px-2 py-1 rounded-lg bg-sky-400 w-full"
        />
        <p>Use this key for campaign tracking integrations.</p>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-2 text-xs">
        <h3 className="font-medium text-sm">Notification Preferences</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={account.notifyEmail}
              onChange={e => setAccount(a => ({ ...a, notifyEmail: e.target.checked }))}
            />
            Email Notifications
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={account.notifySMS}
              onChange={e => setAccount(a => ({ ...a, notifySMS: e.target.checked }))}
            />
            SMS Notifications
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="space-y-2 text-xs">
        <h3 className="font-medium text-sm">Security</h3>
        <div className="flex items-center gap-4">
          <button
            onClick={resetPassword}
            className="px-3 py-1 bg-sky-400 rounded-lg"
          >
            Reset Password
          </button>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={account.twoFA}
              onChange={e => setAccount(a => ({ ...a, twoFA: e.target.checked }))}
            />
            Enable Two-Factor Authentication (2FA)
          </label>
        </div>
      </div>

      <div>
        <button onClick={save} className="px-4 py-2 text-xs bg-sky-400 rounded-lg">
          Save Account Settings
        </button>
      </div>
    </div>
  );
}
