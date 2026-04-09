import { useEffect, useState } from "react";
import { adPlacementsAPI } from "../../api/ad-placements";

export default function AdPlacementsDashboard() {
  const [platforms, setPlatforms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [activeAds, setActiveAds] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [platformsData, bookingsData] = await Promise.all([
        adPlacementsAPI.getPlatforms(),
        adPlacementsAPI.getBookings()
      ]);
      setPlatforms(platformsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveAds = async (platformName) => {
    try {
      const ads = await adPlacementsAPI.getActiveAds(platformName);
      setActiveAds(ads);
      setSelectedPlatform(platformName);
    } catch (error) {
      console.error('Failed to load active ads:', error);
    }
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      totalSpent: bookings.reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0),
      totalImpressions: bookings.reduce((sum, b) => sum + (b.impressions || 0), 0),
      totalClicks: bookings.reduce((sum, b) => sum + (b.clicks || 0), 0)
    };
    return stats;
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="space-y-6 text-neutral-50">
        <div className="text-center py-8">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <h2 className="text-xl font-semibold">Ad Placements Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-sky-400">{stats.total}</div>
          <div className="text-sm text-gray-300">Total Bookings</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-gray-300">Active Campaigns</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">${stats.totalSpent.toFixed(2)}</div>
          <div className="text-sm text-gray-300">Total Spent</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.totalImpressions.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Total Impressions</div>
        </div>
      </div>

      {/* Performance Metrics */}
      {stats.totalImpressions > 0 && (
        <div className="bg-blue-950 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Clicks</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-green-400">
                {((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-300">Average CTR</div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                ${(stats.totalSpent / stats.totalClicks).toFixed(2)}
              </div>
              <div className="text-sm text-gray-300">Cost Per Click</div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Availability */}
      <div className="bg-blue-950 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Platform Availability</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => loadActiveAds(platform.name)}
              className="bg-blue-900 p-4 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors"
            >
              <h4 className="font-semibold text-sky-400">{platform.display_name}</h4>
              <div className="text-sm mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{platform.total_placements}</span>
                </div>
                <div className="flex justify-between text-green-400">
                  <span>Available:</span>
                  <span>{platform.available_placements}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Booked:</span>
                  <span>{platform.booked_placements}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(platform.booked_placements / platform.total_placements) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Ads Preview */}
      {selectedPlatform && (
        <div className="bg-blue-950 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Active Ads on {platforms.find(p => p.name === selectedPlatform)?.display_name}
            </h3>
            <button
              onClick={() => setSelectedPlatform(null)}
              className="px-3 py-1 bg-gray-600 rounded text-sm"
            >
              Close
            </button>
          </div>
          
          {activeAds.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No active ads on this platform
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAds.map((ad) => (
                <div key={ad.id} className="bg-blue-900 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sky-400 capitalize">
                      {ad.placement_type} {ad.position_name.split('_')[1]}
                    </h4>
                    <span className="text-xs bg-green-600 px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div><strong>Campaign:</strong> {ad.campaign_name}</div>
                    <div><strong>Size:</strong> {ad.width}x{ad.height}px</div>
                    <div><strong>Duration:</strong> {ad.start_date} to {ad.end_date}</div>
                    
                    {ad.impressions > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <div><strong>Impressions:</strong> {ad.impressions.toLocaleString()}</div>
                        <div><strong>Clicks:</strong> {ad.clicks.toLocaleString()}</div>
                        {ad.impressions > 0 && (
                          <div><strong>CTR:</strong> {((ad.clicks / ad.impressions) * 100).toFixed(2)}%</div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {ad.ad_image_url && (
                    <div className="mt-3">
                      <img 
                        src={ad.ad_image_url} 
                        alt="Ad Creative"
                        className="w-full max-w-32 h-auto rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-blue-950 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No bookings yet. Start by creating your first ad placement!
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-3 bg-blue-900 rounded">
                <div>
                  <div className="font-medium">{booking.campaign_name}</div>
                  <div className="text-sm text-gray-300">
                    {booking.platform_name} - {booking.placement_type}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">${booking.total_price}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    booking.status === 'active' ? 'bg-green-600' :
                    booking.status === 'pending' ? 'bg-yellow-600' :
                    booking.status === 'approved' ? 'bg-blue-600' :
                    'bg-gray-600'
                  }`}>
                    {booking.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
            
            {bookings.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-sm text-gray-400">
                  Showing 5 of {bookings.length} bookings
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}