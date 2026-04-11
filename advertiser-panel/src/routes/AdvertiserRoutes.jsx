import { Routes, Route } from "react-router-dom";
import AdvertiserLayout from "../layout/AdvertiserLayout";
import AdvertiserDashboardHome from "../pages/Dashboard/AdvertiserDashboardHome";
import CampaignsPage from "../pages/Campaigns/CampaignsPage";
import MediaUploadPage from "../pages/Media/MediaUploadPage";
import GeoTargetingPage from "../pages/Geo/GeoTargetingPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";
import AccountPage from "../pages/Account/AccountPage";
import BillingPageNew from "../pages/Billing/BillingPageNew";
import AdPlacementsPage from "../pages/AdPlacements/AdPlacementsPage";

export default function AdvertiserRoutes({ user, onLogout }) {
    return (
        <AdvertiserLayout user={user} onLogout={onLogout}>
            <Routes>
                <Route index element={<AdvertiserDashboardHome />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="media" element={<MediaUploadPage />} />
                <Route path="geo" element={<GeoTargetingPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="ad-placements" element={<AdPlacementsPage />} />
                <Route path="account" element={<AccountPage />} />
                <Route path="billing" element={<BillingPageNew />} />
            </Routes>
        </AdvertiserLayout>
    );
}
