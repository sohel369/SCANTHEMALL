export default function CampaignCard({ campaign, onPause, onEdit }) {
    return (
        <div className="p-4 bg-blue-950 rounded-lg shadow-lg flex flex-col gap-2 text-neutral-50">
            <div className="flex items-start justify-between">
                <div>
                    <div className="text-base font-semibold">{campaign.title}</div>
                    <div className="text-xs">Region: {campaign.region} • Budget: ${campaign.budget}</div>
                </div>
                <div className="text-xs px-2 py-1 rounded-lg bg-sky-400">{campaign.status}</div>
            </div>

            <div className="flex items-center gap-2">
                <div className="text-sm">Impr: {campaign.impressions}</div>
                <div className="text-sm">Clicks: {campaign.clicks}</div>
                <div className="text-sm">CTR: {campaign.impressions ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + "%" : "0.00%"}</div>
            </div>

            <div className="flex gap-2 mt-2">
                <button onClick={() => onPause(campaign.id)} className="px-2 py-2 rounded-lg bg-sky-400">Pause/Resume</button>
                <button onClick={() => onEdit(campaign.id)} className="px-2 py-2 rounded-lg bg-sky-400">Edit</button>
            </div>
        </div>
    );
}
