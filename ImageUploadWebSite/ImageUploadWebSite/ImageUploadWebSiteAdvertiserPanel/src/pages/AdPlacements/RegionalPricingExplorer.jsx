import { useEffect, useState } from "react";
import { adPlacementsAPI } from "../../api/ad-placements";

export default function RegionalPricingExplorer() {
  const [regionalPricing, setRegionalPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_multiplier');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterCountry, setFilterCountry] = useState('');

  useEffect(() => {
    loadRegionalPricing();
  }, []);

  const loadRegionalPricing = async () => {
    try {
      setLoading(true);
      // Use the 'all=true' parameter to get all regional pricing data
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/ad-placements/regional-pricing?all=true`);
      const data = await response.json();
      setRegionalPricing(data);
    } catch (error) {
      console.error('Failed to load regional pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPricing = regionalPricing
    .filter(region => {
      const matchesSearch = searchTerm === '' || 
        region.region_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (region.state_province && region.state_province.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCountry = filterCountry === '' || region.country === filterCountry;
      
      return matchesSearch && matchesCountry;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'price_multiplier') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const uniqueCountries = [...new Set(regionalPricing.map(r => r.country))].sort();

  const getPricingColor = (multiplier) => {
    const value = parseFloat(multiplier);
    if (value >= 2.0) return 'text-red-400';
    if (value >= 1.5) return 'text-orange-400';
    if (value >= 1.2) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getDensityColor = (density) => {
    const colors = {
      'very_high': 'bg-red-600',
      'high': 'bg-orange-600',
      'medium': 'bg-yellow-600',
      'low': 'bg-green-600'
    };
    return colors[density] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-6 text-neutral-50">
        <div className="text-center py-8">
          <div className="text-lg">Loading regional pricing data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Regional Pricing Explorer</h2>
        <button
          onClick={loadRegionalPricing}
          className="px-4 py-2 bg-sky-400 text-black rounded-lg"
        >
          Refresh Data
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-blue-950 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search Regions</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by region, country, or state..."
              className="w-full p-2 rounded bg-sky-400 text-black"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Filter by Country</label>
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full p-2 rounded bg-sky-400 text-black"
            >
              <option value="">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded bg-sky-400 text-black"
            >
              <option value="price_multiplier">Price Multiplier</option>
              <option value="region_name">Region Name</option>
              <option value="country">Country</option>
              <option value="population_density">Population Density</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 rounded bg-sky-400 text-black"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-sky-400">{regionalPricing.length}</div>
          <div className="text-sm text-gray-300">Total Regions</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-400">
            {Math.min(...regionalPricing.map(r => parseFloat(r.price_multiplier))).toFixed(2)}x
          </div>
          <div className="text-sm text-gray-300">Lowest Multiplier</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-400">
            {Math.max(...regionalPricing.map(r => parseFloat(r.price_multiplier))).toFixed(2)}x
          </div>
          <div className="text-sm text-gray-300">Highest Multiplier</div>
        </div>
        
        <div className="bg-blue-950 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-400">
            {(regionalPricing.reduce((sum, r) => sum + parseFloat(r.price_multiplier), 0) / regionalPricing.length).toFixed(2)}x
          </div>
          <div className="text-sm text-gray-300">Average Multiplier</div>
        </div>
      </div>

      {/* Regional Pricing Table */}
      <div className="bg-blue-950 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold">
            Regional Pricing Data ({filteredAndSortedPricing.length} regions)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-900">
              <tr>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">State/Province</th>
                <th className="px-4 py-3 text-center">Price Multiplier</th>
                <th className="px-4 py-3 text-center">Population Density</th>
                <th className="px-4 py-3 text-center">Example Price*</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPricing.map((region, index) => (
                <tr key={region.id || index} className="border-b border-gray-700 hover:bg-blue-900">
                  <td className="px-4 py-3 font-medium">{region.region_name}</td>
                  <td className="px-4 py-3">{region.country}</td>
                  <td className="px-4 py-3">{region.state_province || '-'}</td>
                  <td className={`px-4 py-3 text-center font-bold ${getPricingColor(region.price_multiplier)}`}>
                    {parseFloat(region.price_multiplier).toFixed(2)}x
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getDensityColor(region.population_density)}`}>
                      {region.population_density?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    ${(150 * parseFloat(region.price_multiplier)).toFixed(0)}/mo
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 text-sm text-gray-400 border-t border-gray-600">
          * Example price based on $150/month base rate for leaderboard ads
        </div>
      </div>

      {/* Pricing Distribution Chart */}
      <div className="bg-blue-950 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Price Multiplier Distribution</h3>
        <div className="space-y-2">
          {[
            { range: '1.0x - 1.2x', color: 'bg-green-500', count: regionalPricing.filter(r => parseFloat(r.price_multiplier) >= 1.0 && parseFloat(r.price_multiplier) < 1.2).length },
            { range: '1.2x - 1.5x', color: 'bg-yellow-500', count: regionalPricing.filter(r => parseFloat(r.price_multiplier) >= 1.2 && parseFloat(r.price_multiplier) < 1.5).length },
            { range: '1.5x - 2.0x', color: 'bg-orange-500', count: regionalPricing.filter(r => parseFloat(r.price_multiplier) >= 1.5 && parseFloat(r.price_multiplier) < 2.0).length },
            { range: '2.0x+', color: 'bg-red-500', count: regionalPricing.filter(r => parseFloat(r.price_multiplier) >= 2.0).length }
          ].map(({ range, color, count }) => (
            <div key={range} className="flex items-center gap-3">
              <div className="w-20 text-sm">{range}</div>
              <div className="flex-1 bg-gray-700 rounded-full h-6 relative">
                <div 
                  className={`${color} h-6 rounded-full flex items-center justify-end pr-2`}
                  style={{ width: `${(count / regionalPricing.length) * 100}%` }}
                >
                  {count > 0 && (
                    <span className="text-white text-xs font-semibold">{count}</span>
                  )}
                </div>
              </div>
              <div className="w-16 text-sm text-right">
                {((count / regionalPricing.length) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}