import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import UsersPage from "../pages/Users/UsersPage";
import UploadsPage from "../pages/Uploads/UploadsPage";
import DrawsPage from "../pages/Draws/DrawsPage";
import AdsPage from "../pages/Ads/AdsPage";
import SettingsPage from "../pages/Settings/SettingsPage";
import PolicyPage from "../pages/Policy/PolicyPage";
import NotificationCenter from "../pages/Notifications/NotificationCenter";

export default function AppRoutes({ logout }) {
    return (
        <MainLayout logout={logout}>
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/uploads" element={<UploadsPage />} />
                <Route path="/draws" element={<DrawsPage />} />
                <Route path="/ads" element={<AdsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/policy" element={<PolicyPage />} />
                <Route path="/notifications" element={<NotificationCenter />} />
            </Routes>
        </MainLayout>
    );
}
