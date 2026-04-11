export default function AdPlacementsOverview() {
  return (
    <div className="space-y-6 text-neutral-50">
      <div className="bg-gradient-to-r from-blue-950 to-sky-900 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Social Media Ad Placements System</h2>
        <p className="text-lg text-gray-200 mb-6">
          Comprehensive advertising platform with 4 premium ad positions per social media platform, 
          regional pricing optimization, and real-time booking management.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-sky-400 mb-2">📱 14 Social Platforms</h3>
            <p className="text-sm text-gray-300">
              Facebook, Instagram, X (Twitter), TikTok, YouTube, LinkedIn, Snapchat, 
              Pinterest, Reddit, Telegram, WeChat, Weibo, Kuaishou, Douyin
            </p>
          </div>
          
          <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-sky-400 mb-2">🎯 4 Ad Positions Each</h3>
            <p className="text-sm text-gray-300">
              2 Leaderboard positions (728x90px) and 2 Skyscraper positions (160x600px) 
              per platform for maximum visibility
            </p>
          </div>
          
          <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-sky-400 mb-2">🌍 Regional Pricing</h3>
            <p className="text-sm text-gray-300">
              Dynamic pricing based on 30-mile radius regions with multipliers 
              from 1.0x to 2.2x based on population density
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Features */}
        <div className="bg-blue-950 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">🚀 System Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <div>
                <div className="font-medium">Real-time Availability</div>
                <div className="text-sm text-gray-400">Live booking status and conflict detection</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <div>
                <div className="font-medium">Dynamic Pricing Calculator</div>
                <div className="text-sm text-gray-400">Regional multipliers and duration-based pricing</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <div>
                <div className="font-medium">Visual Ad Preview</div>
                <div className="text-sm text-gray-400">See how your ads will look on each platform</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <div>
                <div className="font-medium">Booking Management</div>
                <div className="text-sm text-gray-400">Track campaigns, performance, and status updates</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✓</span>
              <div>
                <div className="font-medium">Performance Analytics</div>
                <div className="text-sm text-gray-400">Impressions, clicks, CTR, and cost metrics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Structure */}
        <div className="bg-blue-950 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-sky-400">💰 Pricing Structure</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Base Rates (per month)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Leaderboard (728x90px)</span>
                  <span className="font-medium">$150/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Skyscraper (160x600px)</span>
                  <span className="font-medium">$120/month</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Regional Multipliers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Low Density Areas</span>
                  <span className="text-green-400">1.0x - 1.2x</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Density Areas</span>
                  <span className="text-yellow-400">1.2x - 1.5x</span>
                </div>
                <div className="flex justify-between">
                  <span>High Density Areas</span>
                  <span className="text-orange-400">1.5x - 2.0x</span>
                </div>
                <div className="flex justify-between">
                  <span>Very High Density Areas</span>
                  <span className="text-red-400">2.0x+</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-900 p-3 rounded">
              <div className="text-sm">
                <div className="font-medium mb-1">Example: NYC Leaderboard</div>
                <div>Base: $150 × 2.0x multiplier × 3 months = <span className="font-bold text-green-400">$900</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Grid */}
      <div className="bg-blue-950 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-sky-400">📊 Platform Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            { name: 'Facebook', icon: '📘', users: '2.9B' },
            { name: 'Instagram', icon: '📷', users: '2.0B' },
            { name: 'X (Twitter)', icon: '🐦', users: '450M' },
            { name: 'TikTok', icon: '🎵', users: '1.0B' },
            { name: 'YouTube', icon: '📺', users: '2.7B' },
            { name: 'LinkedIn', icon: '💼', users: '900M' },
            { name: 'Snapchat', icon: '👻', users: '750M' },
            { name: 'Pinterest', icon: '📌', users: '450M' },
            { name: 'Reddit', icon: '🤖', users: '430M' },
            { name: 'Telegram', icon: '✈️', users: '700M' },
            { name: 'WeChat', icon: '💬', users: '1.3B' },
            { name: 'Weibo', icon: '🌐', users: '580M' },
            { name: 'Kuaishou', icon: '⚡', users: '600M' },
            { name: 'Douyin', icon: '🎭', users: '750M' }
          ].map((platform) => (
            <div key={platform.name} className="bg-blue-900 p-3 rounded text-center">
              <div className="text-2xl mb-1">{platform.icon}</div>
              <div className="text-xs font-medium">{platform.name}</div>
              <div className="text-xs text-gray-400">{platform.users}</div>
              <div className="text-xs text-sky-400 mt-1">4 slots</div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-sky-900 to-blue-950 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-sky-400">🎯 Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-sky-400 text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 font-bold">1</div>
            <div className="font-medium">Browse Platforms</div>
            <div className="text-sm text-gray-300">Explore available ad positions</div>
          </div>
          
          <div className="text-center">
            <div className="bg-sky-400 text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 font-bold">2</div>
            <div className="font-medium">Select Position</div>
            <div className="text-sm text-gray-300">Choose your preferred ad slot</div>
          </div>
          
          <div className="text-center">
            <div className="bg-sky-400 text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 font-bold">3</div>
            <div className="font-medium">Configure Campaign</div>
            <div className="text-sm text-gray-300">Set region, dates, and creative</div>
          </div>
          
          <div className="text-center">
            <div className="bg-sky-400 text-black rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2 font-bold">4</div>
            <div className="font-medium">Book & Launch</div>
            <div className="text-sm text-gray-300">Submit for approval and go live</div>
          </div>
        </div>
      </div>
    </div>
  );
}