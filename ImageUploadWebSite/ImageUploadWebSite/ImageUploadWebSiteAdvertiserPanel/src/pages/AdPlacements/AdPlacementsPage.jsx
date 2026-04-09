import { useEffect, useState } from "react";
import { adPlacementsAPI } from "../../api/ad-placements";
import AdPlacementsOverview from "./AdPlacementsOverview";
import AdPlacementsDashboard from "./AdPlacementsDashboard";
import AdBookingsManagement from "./AdBookingsManagement";
import RegionalPricingExplorer from "./RegionalPricingExplorer";
import AdPlacementPreview from "../../components/AdPlacementPreview";

export default function AdPlacementsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    campaign_name: '',
    ad_image_url: '',
    ad_link_url: '',
    region: '',
    postal_code: '',
    start_date: '',
    end_date: ''
  });
  const [pricing, setPricing] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const data = await adPlacementsAPI.getPlatforms();
      setPlatforms(data);
    } catch (error) {
      console.error('Failed to load platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlacements = async (platform) => {
    try {
      const data = await adPlacementsAPI.getPlatformPlacements(platform);
      setPlacements(data);
      setSelectedPlatform(platform);
    } catch (error) {
      console.error('Failed to load placements:', error);
    }
  };

  const calculatePricing = async () => {
    if (!selectedPlacement || !bookingForm.region || !bookingForm.start_date || !bookingForm.end_date) {
      return;
    }

    try {
      const pricingData = await adPlacementsAPI.calculatePricing(
        selectedPlacement.id,
        bookingForm.region,
        bookingForm.start_date,
        bookingForm.end_date
      );
      setPricing(pricingData);
    } catch (error) {
      console.error('Failed to calculate pricing:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!pricing) {
      alert('Please calculate pricing first');
      return;
    }

    try {
      await adPlacementsAPI.createBooking({
        placement_id: selectedPlacement.id,
        campaign_name: bookingForm.campaign_name,
        ad_image_url: bookingForm.ad_image_url,
        ad_link_url: bookingForm.ad_link_url,
        region: bookingForm.region,
        postal_code: bookingForm.postal_code,
        start_date: bookingForm.start_date,
        end_date: bookingForm.end_date,
        monthly_price: pricing.monthly_price,
        total_price: pricing.total_price
      });

      alert('Ad booking created successfully! It will be reviewed by our team.');
      setShowBookingForm(false);
      setBookingForm({
        campaign_name: '',
        ad_image_url: '',
        ad_link_url: '',
        region: '',
        postal_code: '',
        start_date: '',
        end_date: ''
      });
      setPricing(null);
      setSelectedPlacement(null);
      
      // Reload placements to show updated availability
      if (selectedPlatform) {
        loadPlacements(selectedPlatform);
      }
    } catch (error) {
      alert('Failed to create booking: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
    
    // Recalculate pricing when relevant fields change
    if (['region', 'start_date', 'end_date'].includes(field)) {
      setPricing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 text-neutral-50">
        <div className="text-center py-8">
          <div className="text-lg">Loading ad placements...</div>
        </div>
      </div>
    );
  }

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex flex-wrap space-x-1 bg-blue-950 p-1 rounded-lg mb-6">
      <button
        onClick={() => setActiveTab('overview')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'overview' 
            ? 'bg-sky-400 text-black font-medium' 
            : 'text-neutral-50 hover:bg-blue-900'
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'dashboard' 
            ? 'bg-sky-400 text-black font-medium' 
            : 'text-neutral-50 hover:bg-blue-900'
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => setActiveTab('browse')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'browse' 
            ? 'bg-sky-400 text-black font-medium' 
            : 'text-neutral-50 hover:bg-blue-900'
        }`}
      >
        Browse & Book
      </button>
      <button
        onClick={() => setActiveTab('bookings')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'bookings' 
            ? 'bg-sky-400 text-black font-medium' 
            : 'text-neutral-50 hover:bg-blue-900'
        }`}
      >
        My Bookings
      </button>
      <button
        onClick={() => setActiveTab('pricing')}
        className={`px-4 py-2 rounded-md transition-colors ${
          activeTab === 'pricing' 
            ? 'bg-sky-400 text-black font-medium' 
            : 'text-neutral-50 hover:bg-blue-900'
        }`}
      >
        Regional Pricing
      </button>
    </div>
  );

  // Render different components based on active tab
  if (activeTab === 'overview') {
    return (
      <div className="space-y-6 text-neutral-50">
        <h2 className="text-xl font-semibold">Social Media Ad Placements</h2>
        <TabNavigation />
        <AdPlacementsOverview />
      </div>
    );
  }

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6 text-neutral-50">
        <h2 className="text-xl font-semibold">Social Media Ad Placements</h2>
        <TabNavigation />
        <AdPlacementsDashboard />
      </div>
    );
  }

  if (activeTab === 'bookings') {
    return (
      <div className="space-y-6 text-neutral-50">
        <h2 className="text-xl font-semibold">Social Media Ad Placements</h2>
        <TabNavigation />
        <AdBookingsManagement />
      </div>
    );
  }

  if (activeTab === 'pricing') {
    return (
      <div className="space-y-6 text-neutral-50">
        <h2 className="text-xl font-semibold">Social Media Ad Placements</h2>
        <TabNavigation />
        <RegionalPricingExplorer />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <h2 className="text-xl font-semibold">Social Media Ad Placements</h2>
      <TabNavigation />
      
      {!selectedPlatform ? (
        // Platform Selection
        <div>
          <h3 className="text-lg font-medium mb-4">Select a Social Media Platform</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                onClick={() => loadPlacements(platform.name)}
                className="bg-blue-950 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-blue-900 transition-colors"
              >
                <h4 className="font-semibold text-sky-400">{platform.display_name}</h4>
                <div className="text-sm mt-2">
                  <div>Total Slots: {platform.total_placements}</div>
                  <div className="text-green-400">Available: {platform.available_placements}</div>
                  <div className="text-red-400">Booked: {platform.booked_placements}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Placement Selection and Booking
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {platforms.find(p => p.name === selectedPlatform)?.display_name} Ad Placements
            </h3>
            <button
              onClick={() => {
                setSelectedPlatform(null);
                setPlacements([]);
                setSelectedPlacement(null);
                setShowBookingForm(false);
              }}
              className="px-3 py-1 bg-gray-600 rounded-lg text-sm"
            >
              ← Back to Platforms
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {placements.map((placement) => (
              <div
                key={placement.id}
                className={`bg-blue-950 p-4 rounded-lg shadow-lg border-2 ${
                  placement.availability_status === 'available' 
                    ? 'border-green-500 cursor-pointer hover:bg-blue-900' 
                    : 'border-red-500 opacity-60'
                } ${selectedPlacement?.id === placement.id ? 'ring-2 ring-sky-400' : ''}`}
                onClick={() => {
                  if (placement.availability_status === 'available') {
                    setSelectedPlacement(placement);
                    setShowBookingForm(true);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sky-400 capitalize">
                    {placement.placement_type} {placement.position_name.split('_')[1]}
                  </h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    placement.availability_status === 'available' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {placement.availability_status}
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  <div>Size: {placement.width}x{placement.height}px</div>
                  <div>Base Price: ${placement.base_price}/month</div>
                  <div className="text-gray-400">{placement.description}</div>
                  
                  {placement.availability_status === 'booked' && (
                    <div className="text-red-400 text-xs mt-2">
                      Booked: {placement.booked_start} to {placement.booked_end}
                      <br />Campaign: {placement.booked_campaign}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          {showBookingForm && selectedPlacement && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-blue-950 p-6 rounded-lg shadow-lg">
                <h4 className="text-lg font-semibold mb-4">
                  Book {selectedPlacement.placement_type} - {selectedPlacement.platform_name}
                </h4>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Campaign Name</label>
                    <input
                      type="text"
                      value={bookingForm.campaign_name}
                      onChange={(e) => handleInputChange('campaign_name', e.target.value)}
                      className="w-full p-2 rounded bg-sky-400 text-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Region</label>
                    <input
                      type="text"
                      value={bookingForm.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      placeholder="e.g., Los Angeles Metro, New York Metro"
                      className="w-full p-2 rounded bg-sky-400 text-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={bookingForm.start_date}
                      onChange={(e) => handleInputChange('start_date', e.target.value)}
                      className="w-full p-2 rounded bg-sky-400 text-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={bookingForm.end_date}
                      onChange={(e) => handleInputChange('end_date', e.target.value)}
                      className="w-full p-2 rounded bg-sky-400 text-black"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Ad Image URL</label>
                    <input
                      type="url"
                      value={bookingForm.ad_image_url}
                      onChange={(e) => handleInputChange('ad_image_url', e.target.value)}
                      placeholder="https://example.com/ad-image.jpg"
                      className="w-full p-2 rounded bg-sky-400 text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Ad Link URL</label>
                    <input
                      type="url"
                      value={bookingForm.ad_link_url}
                      onChange={(e) => handleInputChange('ad_link_url', e.target.value)}
                      placeholder="https://your-website.com"
                      className="w-full p-2 rounded bg-sky-400 text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code (Optional)</label>
                    <input
                      type="text"
                      value={bookingForm.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className="w-full p-2 rounded bg-sky-400 text-black"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={calculatePricing}
                    className="px-4 py-2 bg-yellow-600 rounded-lg"
                    disabled={!bookingForm.region || !bookingForm.start_date || !bookingForm.end_date}
                  >
                    Calculate Pricing
                  </button>
                  
                  {pricing && (
                    <div className="flex-1 bg-green-900 p-3 rounded-lg">
                      <div className="text-sm">
                        <div>Base Price: ${pricing.base_price}/month</div>
                        <div>Regional Multiplier: {pricing.price_multiplier}x</div>
                        <div>Monthly Price: ${pricing.monthly_price}</div>
                        <div>Duration: {pricing.duration_months} months ({pricing.duration_days} days)</div>
                        <div className="font-bold text-lg">Total: ${pricing.total_price}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!pricing}
                    className="px-6 py-2 bg-sky-400 rounded-lg disabled:opacity-50"
                  >
                    Book Ad Placement
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedPlacement(null);
                      setPricing(null);
                    }}
                    className="px-6 py-2 bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
              
              {/* Ad Preview */}
              <div>
                <AdPlacementPreview 
                  platform={selectedPlatform}
                  placement={selectedPlacement}
                  adImageUrl={bookingForm.ad_image_url}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}