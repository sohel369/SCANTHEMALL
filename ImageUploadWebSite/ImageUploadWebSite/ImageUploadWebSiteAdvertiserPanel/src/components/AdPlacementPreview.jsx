import { useState } from 'react';

export default function AdPlacementPreview({ platform, placement, adImageUrl }) {
  const [imageError, setImageError] = useState(false);

  // Mock social media platform layouts
  const getPlatformLayout = () => {
    const commonStyles = {
      container: "bg-gray-800 rounded-lg p-4 max-w-md mx-auto",
      header: "flex items-center gap-3 mb-4",
      avatar: "w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold",
      content: "bg-gray-700 rounded p-3 mb-3",
      adContainer: "border-2 border-yellow-400 rounded p-2"
    };

    const mockContent = {
      facebook: {
        name: "Facebook User",
        content: "Just had an amazing day at the beach! 🏖️ #blessed",
        avatar: "FB"
      },
      instagram: {
        name: "insta_user",
        content: "Beautiful sunset today ✨",
        avatar: "IG"
      },
      x: {
        name: "@twitter_user",
        content: "Breaking: Amazing news everyone! This is a sample tweet to show ad placement.",
        avatar: "X"
      },
      tiktok: {
        name: "tiktok_creator",
        content: "Check out this viral dance! 💃",
        avatar: "TT"
      },
      youtube: {
        name: "YouTuber Channel",
        content: "New video: How to create amazing content!",
        avatar: "YT"
      }
    };

    const platformData = mockContent[platform] || mockContent.facebook;

    return (
      <div className={commonStyles.container}>
        {/* Platform Header */}
        <div className={commonStyles.header}>
          <div className={commonStyles.avatar}>
            {platformData.avatar}
          </div>
          <div>
            <div className="font-semibold text-white">{platformData.name}</div>
            <div className="text-xs text-gray-400">2 hours ago</div>
          </div>
        </div>

        {/* Mock Content */}
        <div className={commonStyles.content}>
          <p className="text-white text-sm">{platformData.content}</p>
        </div>

        {/* Ad Placement */}
        <div className={commonStyles.adContainer}>
          <div className="text-xs text-yellow-400 mb-2 font-semibold">
            SPONSORED AD - {placement.placement_type.toUpperCase()} {placement.position_name.split('_')[1]}
          </div>
          
          {adImageUrl && !imageError ? (
            <div className="relative">
              <img
                src={adImageUrl}
                alt="Ad Preview"
                className="w-full rounded"
                style={{
                  maxWidth: `${placement.width}px`,
                  maxHeight: `${placement.height}px`,
                  aspectRatio: `${placement.width}/${placement.height}`
                }}
                onError={() => setImageError(true)}
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {placement.width}x{placement.height}
              </div>
            </div>
          ) : (
            <div 
              className="bg-gray-600 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 rounded"
              style={{
                width: `${Math.min(placement.width, 300)}px`,
                height: `${Math.min(placement.height, 200)}px`,
                aspectRatio: `${placement.width}/${placement.height}`
              }}
            >
              <div className="text-center">
                <div className="text-sm font-semibold">Ad Preview</div>
                <div className="text-xs">{placement.width}x{placement.height}px</div>
                <div className="text-xs mt-1">
                  {adImageUrl ? 'Image failed to load' : 'No image provided'}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-300">
            <div className="font-semibold">Your Campaign Name Here</div>
            <div>Click to learn more →</div>
          </div>
        </div>

        {/* More mock content */}
        <div className="mt-4 text-xs text-gray-500">
          <div className="flex gap-4">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>📤 Share</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-blue-950 p-4 rounded-lg">
      <h4 className="text-lg font-semibold mb-4 text-sky-400">
        Ad Preview - {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </h4>
      {getPlatformLayout()}
      <div className="mt-4 text-sm text-gray-400 text-center">
        This is a mockup showing how your ad would appear on {platform}
      </div>
    </div>
  );
}