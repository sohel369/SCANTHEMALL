import { useEffect, useState } from "react";
import { adPlacementsAPI } from "../../api/ad-placements";

export default function AdBookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await adPlacementsAPI.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await adPlacementsAPI.updateBookingStatus(bookingId, newStatus);
      await loadBookings(); // Reload bookings
      alert(`Booking status updated to ${newStatus}`);
    } catch (error) {
      alert('Failed to update booking status: ' + error.message);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-600',
      approved: 'bg-green-600',
      active: 'bg-blue-600',
      paused: 'bg-orange-600',
      completed: 'bg-gray-600',
      rejected: 'bg-red-600'
    };
    return colors[status] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-6 text-neutral-50">
        <div className="text-center py-8">
          <div className="text-lg">Loading ad bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Ad Bookings</h2>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 bg-blue-950 rounded-lg border border-sky-400"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button
            onClick={loadBookings}
            className="px-4 py-1 bg-sky-400 text-black rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-8 bg-blue-950 rounded-lg">
          <div className="text-lg mb-2">No bookings found</div>
          <div className="text-gray-400">
            {filter === 'all' 
              ? 'You haven\'t made any ad bookings yet.' 
              : `No bookings with status "${filter}".`}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-blue-950 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-sky-400">
                    {booking.campaign_name}
                  </h3>
                  <div className="text-sm text-gray-300">
                    {booking.platform_name} - {booking.placement_type} {booking.position_name.split('_')[1]}
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Region</div>
                  <div>{booking.region}</div>
                  {booking.postal_code && (
                    <>
                      <div className="text-gray-400 mt-1">Postal Code</div>
                      <div>{booking.postal_code}</div>
                    </>
                  )}
                </div>
                
                <div>
                  <div className="text-gray-400">Duration</div>
                  <div>{booking.start_date} to {booking.end_date}</div>
                  <div className="text-gray-400 mt-1">Ad Size</div>
                  <div>{booking.width}x{booking.height}px</div>
                </div>
                
                <div>
                  <div className="text-gray-400">Pricing</div>
                  <div>${booking.monthly_price}/month</div>
                  <div className="text-gray-400 mt-1">Total</div>
                  <div className="font-semibold text-green-400">${booking.total_price}</div>
                </div>
              </div>

              {booking.ad_image_url && (
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-2">Ad Creative</div>
                  <div className="flex gap-4 items-center">
                    <img 
                      src={booking.ad_image_url} 
                      alt="Ad Creative"
                      className="w-20 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="text-sm">
                      <div className="text-gray-400">Image URL:</div>
                      <div className="break-all">{booking.ad_image_url}</div>
                      {booking.ad_link_url && (
                        <>
                          <div className="text-gray-400 mt-1">Link URL:</div>
                          <div className="break-all">{booking.ad_link_url}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {booking.impressions > 0 || booking.clicks > 0 ? (
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <div className="text-gray-400 text-sm mb-2">Performance</div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">Impressions:</span> {booking.impressions.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-400">Clicks:</span> {booking.clicks.toLocaleString()}
                    </div>
                    {booking.impressions > 0 && (
                      <div>
                        <span className="text-gray-400">CTR:</span> {((booking.clicks / booking.impressions) * 100).toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(booking.created_at).toLocaleDateString()} | 
                Updated: {new Date(booking.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}