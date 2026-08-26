export default function CampaignCard({ campaign, onPause, onEdit }) {
    const statusUpper = (campaign.status || "active").toLowerCase();
    const ctr = campaign.impressions ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + "%" : "0.00%";

    return (
        <div className="glass-card p-5 rounded-2xl border border-white/10 hover:border-sky-500/30 flex flex-col justify-between gap-4 text-slate-100 transition-all duration-300 shadow-xl group">
            <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-base font-extrabold text-white tracking-tight group-hover:text-sky-400 transition-colors">
                        {campaign.title}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 flex-shrink-0 ${
                        statusUpper === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : statusUpper === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusUpper === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {campaign.status}
                    </span>
                </div>
                <div className="text-xs font-medium text-slate-400">
                    Region: <span className="text-slate-200 font-semibold">{campaign.region}</span> • Budget: <span className="text-emerald-400 font-semibold">${campaign.budget}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Impr</div>
                    <div className="text-xs font-black text-slate-200">{campaign.impressions?.toLocaleString() || 0}</div>
                </div>
                <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Clicks</div>
                    <div className="text-xs font-black text-sky-400">{campaign.clicks?.toLocaleString() || 0}</div>
                </div>
                <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">CTR</div>
                    <div className="text-xs font-black text-emerald-400">{ctr}</div>
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <button 
                    onClick={() => onPause(campaign.id)} 
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 border border-white/10 text-slate-300 text-xs font-bold transition-all"
                >
                    Pause/Resume
                </button>
                <button 
                    onClick={() => onEdit(campaign.id)} 
                    className="py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all"
                >
                    Edit
                </button>
            </div>
        </div>
    );
}
