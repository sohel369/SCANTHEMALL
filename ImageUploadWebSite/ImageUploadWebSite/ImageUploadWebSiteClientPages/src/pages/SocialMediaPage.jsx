import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { adsAPI, uploadAPI, userAPI, drawAPI } from "../api/api";
import { getUploadUrl } from "../utils/urlHelper";
import NotFoundPage from "./NotFoundPage";
import UploadModal from "../components/UploadModal";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
import './SocialMediaPage.css'

const socialPlatforms = [
  { name: 'Instagram', src: "/assets/icons/instagram-icon.png" },
  { name: 'Tiktok', src: "/assets/icons/tiktok-icon.png" },
  { name: 'Youtube', src: "/assets/icons/youtube-icon.png" },
  { name: 'Snapchat', src: "/assets/icons/snapchat-icon.png" },
  { name: 'Telegram', src: "/assets/icons/telegram-icon.png" },
  { name: 'Pinterest', src: "/assets/icons/pinterest-icon.png" },
  { name: 'Reddit', src: "/assets/icons/reddit-icon.png" },
  { name: 'WeChat', src: "/assets/icons/wechat-icon.png" },
  { name: 'Kuaishou', src: "/assets/icons/kuaishou-icon.png" },
  { name: 'Douyin', src: "/assets/icons/douyin-icon.png" },
  { name: 'Facebook', src: "/assets/icons/facebook-icon.png" },
  { name: 'Weibo', src: "/assets/icons/weibo-icon.png" },
  { name: 'X', src: "/assets/icons/twitter-icon.png" }
]

const mobileSocialPlatforms1 = [
  { name: 'Instagram', src: "/assets/icons/instagram-icon.png" },
  { name: 'Tiktok', src: "/assets/icons/tiktok-icon.png" },
  { name: 'Youtube', src: "/assets/icons/youtube-icon.png" },
  { name: 'Snapchat', src: "/assets/icons/snapchat-icon.png" },
  { name: 'Telegram', src: "/assets/icons/telegram-icon.png" },
  { name: 'Pinterest', src: "/assets/icons/pinterest-icon.png" },
  { name: 'X', src: "/assets/icons/twitter-icon.png" }
]

const mobileSocialPlatforms2 = [
  { name: 'Reddit', src: "/assets/icons/reddit-icon.png" },
  { name: 'WeChat', src: "/assets/icons/wechat-icon.png" },
  { name: 'Kuaishou', src: "/assets/icons/kuaishou-icon.png" },
  { name: 'Douyin', src: "/assets/icons/douyin-icon.png" },
  { name: 'Facebook', src: "/assets/icons/facebook-icon.png" },
  { name: 'Weibo', src: "/assets/icons/weibo-icon.png" }
]

const SocialMediaPage = () => {
  const { social } = useParams();
  const allowed = ["facebook", "instagram", "x", "snapchat", "tiktok", "youtube", "telegram", "pinterest", "reddit", "wechat", "weibo", "kuaishou", "douyin"];
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userUploads, setUserUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [dailyUploadCount, setDailyUploadCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState({ totalEntries: 0, rank: 0 });
  const [loading, setLoading] = useState(true);
  const DAILY_LIMIT = 15;

  // Fetch user's uploads, profile, and stats
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUploadsLoading(true);
        setLoading(true);
        const [uploads, profile, stats] = await Promise.all([
          uploadAPI.getUserUploads(),
          userAPI.getProfile(),
          drawAPI.getUserPosition()
        ]);
        
        // Filter uploads for today and this platform
        const today = new Date().toDateString();
        const todayUploads = uploads.filter(upload => {
          const uploadDate = new Date(upload.created_at).toDateString();
          return uploadDate === today;
        });
        
        const platformUploads = uploads.filter(upload => 
          upload.platform?.toLowerCase() === social?.toLowerCase()
        );
        
        setUserUploads(platformUploads);
        setDailyUploadCount(todayUploads.length);
        setUserProfile(profile);
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserUploads([]);
        setDailyUploadCount(0);
      } finally {
        setUploadsLoading(false);
        setLoading(false);
      }
    };

    if (allowed.includes(social)) {
      fetchUserData();
    }
  }, [social]);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUserProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
  };

  const handleUploadSuccess = () => {
    // Refresh uploads after successful upload
    window.location.reload();
  };

  // Format number to always show 4 digits
  const formatEntryCount = (count) => {
    return String(count).padStart(4, '0').split('');
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setAdsLoading(true);
        // Normalize platform name (e.g., "x" to "x", "instagram" to "instagram")
        const platformName = social.toLowerCase();
        const activeAds = await adsAPI.getActiveAdsForPlatform(platformName);
        setAds(activeAds || []);
      } catch (error) {
        console.error('Failed to fetch ads:', error);
        setAds([]);
      } finally {
        setAdsLoading(false);
      }
    };

    if (allowed.includes(social)) {
      fetchAds();
    }
  }, [social]);

  // Group ads by placement type
  const mediumRectangles = ads.filter(ad => ad.placement_type === 'medium_rectangle');
  const leaderboards = ads.filter(ad => ad.placement_type === 'leaderboard');
  const skyscrapers = ads.filter(ad => ad.placement_type === 'skyscraper');

  if (!allowed.includes(social)) return <NotFoundPage />;
  
  return (
    <>
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        platform={social}
        onSuccess={handleUploadSuccess}
      />
      
      <div className="socialmedia-page">
      <div className="sidebar">
        <div className="upload-photo-section">
          <div className="upload-photo-image">
            <ProfilePhotoUpload 
              currentPhotoUrl={userProfile?.profile_photo_url}
              onPhotoUpdate={handlePhotoUpdate}
            />
          </div>
          <div className="upload-label">Upload Photo</div>
        </div>
        <div className="platforms-showcase">
          <svg className="svg1" viewBox="0 0 380 28" fill="none">
            <path d="M379.029 27.5V0H0L379.029 27.5Z" fill="#D4A017" />
          </svg>
          <svg className="svg2" viewBox="0 0 296 181" fill="none">
            <path d="M295.15 22.4701V137.02L0 180.2L261.44 0" fill="#D4A017" />
          </svg>
          <svg className="svg3" viewBox="0 0 382 1326" fill="none">
            <path d="M381.64 1170.11L0 1325.34V0H381.64V1170.11Z" fill="#D91A2A" />
          </svg>
          <svg className="svg4" viewBox="0 0 288 1172" fill="none">
            <path d="M288 1046.49L0 1171.48V0.000366211L288 0V1046.49Z" fill="white" />
          </svg>
          <div className="platforms-heading">Gotta Scan Them All ™</div>
          <div className="platforms-panel">
            {socialPlatforms.map((platform) => (
              <Link to={`/social/${platform.name.toLowerCase()}`} key={platform.name}>
                <div className="platform-card" >
                  <span>{platform.name}</span>
                  <img src={platform.src} alt={platform.name + "-icon"} />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="platforms-mobile-showcase">
          <svg className="svg2" viewBox="0 0 344 39" fill="none">
            <path d="M0 0V22.9836L238.27 34.9259L352 38.3333L0 0Z" fill="#D4A017" />
          </svg>
          <svg className="svg3" viewBox="0 0 315 50" fill="none">
            <path d="M315 6.23476V38.0189L0 50L279.023 0" fill="#D4A017" />
          </svg>
          <svg className="svg1" viewBox="0 0 360 388" fill="none">
            <path d="M374 344.273L-33 387.5V0L257.864 18.4346L374 25.491V344.273Z" fill="#D91A2A" />
          </svg>
          <svg className="svg4" viewBox="0 0 308 341" fill="none">
            <path d="M308 306.163L0 340.833V0L308 19.1676V306.163Z" fill="white" />
          </svg>
          <div className="platforms-mobile-heading">Gotta Scan Them All ™</div>
          <div className="platforms-mobile-panel">
            <div>
              {mobileSocialPlatforms1.map((platform) => (
                <Link to={`/social/${platform.name.toLowerCase()}`} key={platform.name}>
                  <div className="platform-mobile-card" >
                    <span>{platform.name}</span>
                    <img src={platform.src} alt={platform.name + "-icon"} />
                  </div>
                </Link>
              ))}
            </div>
            <div>
              {mobileSocialPlatforms2.map((platform) => (
                <Link to={`/social/${platform.name.toLowerCase()}`} key={platform.name}>
                  <div className="platform-mobile-card" >
                    <span>{platform.name}</span>
                    <img src={platform.src} alt={platform.name + "-icon"} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="entries-display-section">
          <svg className="svg1" viewBox="0 0 120 282" fill="none">
            <path d="M119.02 281.34L79.82 0L0 103.47" fill="#D4A017" />
          </svg>
          <svg className="svg2" viewBox="0 0 393 261" fill="none">
            <path d="M392.11 260.29H0V0H295.21L392.11 260.29Z" fill="#1C2526" />
          </svg>
          <div className="entries-display-card">
            <div className="entries-display-title">
              My Dream Vehicle Draw Entries
            </div>
            <div className="entries-counter">
              {loading ? (
                <>
                  <div className="counter-digit">-</div>
                  <div className="counter-digit">-</div>
                  <div className="counter-digit">-</div>
                  <div className="counter-digit">-</div>
                </>
              ) : (
                formatEntryCount(userStats.totalEntries).map((digit, index) => (
                  <div key={index} className="counter-digit">{digit}</div>
                ))
              )}
            </div>
            {!loading && userStats.rank > 0 && (
              <div className="entries-rank">
                Rank: #{userStats.rank}
              </div>
            )}
          </div>
        </div>
      </div>
      <main className='social-page-content'>
        {/* Top Leaderboard Ads */}
        {leaderboards.length > 0 && (
          <div className="ad-container ad-leaderboard-top">
            {leaderboards.slice(0, 1).map((ad) => (
              <a
                key={ad.id}
                href={ad.ad_link_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-link"
                onClick={() => {
                  // Track click (could be sent to backend)
                  console.log('Ad clicked:', ad.id);
                }}
              >
                <img
                  src={ad.ad_image_url}
                  alt={ad.campaign_name}
                  className="ad-image"
                  style={{ width: '728px', height: '90px', maxWidth: '100%' }}
                />
              </a>
            ))}
          </div>
        )}

        <div className="social-page-icon">
          <img src={`/assets/icons/${social}-icon.png`} alt={`${social}-icon`} />
        </div>
        <section className="photo-grid-section">
          {uploadsLoading ? (
            <div className="loading-message">Loading your uploads...</div>
          ) : (
            <>
              {/* Show user's uploaded photos */}
              {userUploads.map((upload) => (
                <div key={upload.id} className="photo-slot photo-filled">
                  <img 
                    src={getUploadUrl(upload.imageUrl || `/uploads/${upload.filename}`)} 
                    alt={`Upload from ${new Date(upload.created_at).toLocaleDateString()}`}
                    onError={(e) => {
                      console.error('Image load error:', e.target.src);
                    }}
                  />
                  <div className="photo-date">
                    {new Date(upload.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Show upload button if under daily limit */}
              {dailyUploadCount < DAILY_LIMIT && (
                <div 
                  className="photo-slot photo-empty" 
                  onClick={() => setIsUploadModalOpen(true)} 
                  style={{ cursor: 'pointer' }}
                >
                  <div className="upload-placeholder">
                    <span className="upload-icon">+</span>
                    <span className="upload-text">Upload</span>
                    <span className="upload-count">{dailyUploadCount}/{DAILY_LIMIT} today</span>
                  </div>
                </div>
              )}
              
              {/* Show limit reached message */}
              {dailyUploadCount >= DAILY_LIMIT && (
                <div className="photo-slot photo-limit-reached">
                  <div className="limit-message">
                    <span className="limit-icon">🚫</span>
                    <span className="limit-text">Daily Limit Reached</span>
                    <span className="limit-count">{DAILY_LIMIT}/{DAILY_LIMIT}</span>
                  </div>
                </div>
              )}
              
              {/* Fill remaining slots */}
              {Array.from({ length: Math.max(0, 16 - userUploads.length - 1) }).map((_, index) => (
                <div key={`empty-${index}`} className="photo-slot"></div>
              ))}
            </>
          )}
        </section>

        <div className="upload-banner">
          <svg className="svg1" viewBox="0 0 587 31" fill="none">
            <path d="M555.77 30.5L586.38 0L0 18.8201" fill="#D91A2A" />
          </svg>
          <svg className="svg2" viewBox="0 0 682 62" fill="none">
            <path d="M635.28 61.7899L681.97 0L32.22 5.53992L0 61.7899H635.28Z" fill="#1C2526" />
          </svg>
          <svg className="svg3" viewBox="0 0 593 31" fill="none">
            <path d="M17.17 0L0 30.16L592.78 4.98999L17.17 0Z" fill="#D4A017" />
          </svg>
          <span>Upload Screenshots of Your {social} Feed Here</span>
        </div>

        {/* Medium Rectangle Ads (4 positions) */}
        {mediumRectangles.length > 0 && (
          <div className="ad-container ad-medium-rectangles">
            {mediumRectangles.slice(0, 4).map((ad) => (
              <a
                key={ad.id}
                href={ad.ad_link_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-link ad-medium-rectangle"
                onClick={() => {
                  console.log('Ad clicked:', ad.id);
                }}
              >
                <img
                  src={ad.ad_image_url}
                  alt={ad.campaign_name}
                  className="ad-image"
                  style={{ width: '300px', height: '250px', maxWidth: '100%' }}
                />
              </a>
            ))}
          </div>
        )}

        <div className="instructions-part">
          <p className="instructions-text">
            Take a Picture of Yourself Alongside a <span>Gotta Scan Them All ™</span> Vinyl Vehicle
            Wrap from our partners featured in the messages below, upload to your
            Social Media Account and take a screenshot of that post and upload it here.
          </p>
          <p className="instructions-note">
            To ensure your entries are Valid for precise instructions please Click Here
            (Hyperlink to T and C's)
          </p>
          <div className="screenshots">
            <div className="screenshot"></div>
            <div className="screenshot"></div>
            <div className="screenshot"></div>
            <div className="screenshot"></div>
          </div>
        </div>

        {/* Bottom Leaderboard Ad */}
        {leaderboards.length > 1 && (
          <div className="ad-container ad-leaderboard-bottom">
            {leaderboards.slice(1, 2).map((ad) => (
              <a
                key={ad.id}
                href={ad.ad_link_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-link"
                onClick={() => {
                  console.log('Ad clicked:', ad.id);
                }}
              >
                <img
                  src={ad.ad_image_url}
                  alt={ad.campaign_name}
                  className="ad-image"
                  style={{ width: '728px', height: '90px', maxWidth: '100%' }}
                />
              </a>
            ))}
          </div>
        )}

        <div className="prize-showcase">
          <img src={`/assets/prizes/${social}-prize.png`} alt={`${social} prize`} />
          <svg className="svg1" viewBox="0 0 676 43" fill="none">
            <path d="M675.15 3.98999L0 42.46L245.21 9.04004L643.69 0L675.15 3.98999Z" fill="#D91A2A" />
          </svg>
          <svg className="svg2" viewBox="0 0 283 36" fill="none">
            <path d="M253.08 29.35L282.47 0L0 35.5399L253.08 29.35Z" fill="#D4A017" />
          </svg>
          <svg className="svg3" viewBox="0 0 675 35" fill="none">
            <path d="M0 0L674.21 6.13L351.35 34.39L0 0Z" fill="#D91A2A" />
          </svg>
          <svg className="svg4" viewBox="0 0 353 26" fill="none">
            <path d="M62.98 0L0 25.3101L352.04 10.14L62.98 0Z" fill="#D4A017" />
          </svg>
        </div>
        <div className="draw-entry-intro">
          <svg className="svg1" viewBox="0 0 732 57" fill="none">
            <path d="M731.3 0L723.06 8.18994L708.18 23L674.86 56.16H0L46.75 0H731.3Z" fill="#D91A2A" />
          </svg>
          <svg className="svg2" viewBox="0 0 675 15" fill="none">
            <path d="M18.1 0H674.17L659.3 14.7999H0L18.1 0Z" fill="#D4A017" />
          </svg>
          <span>Hyperlink to Details of Prize and Date of Draw</span>
        </div>

        {/* Skyscraper Ads (2 positions) - Side placement */}
        {skyscrapers.length > 0 && (
          <div className="ad-container ad-skyscrapers">
            {skyscrapers.slice(0, 2).map((ad) => (
              <a
                key={ad.id}
                href={ad.ad_link_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-link ad-skyscraper"
                onClick={() => {
                  console.log('Ad clicked:', ad.id);
                }}
              >
                <img
                  src={ad.ad_image_url}
                  alt={ad.campaign_name}
                  className="ad-image"
                  style={{ width: '160px', height: '600px', maxWidth: '100%' }}
                />
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
    </>
  )
}

export default SocialMediaPage
