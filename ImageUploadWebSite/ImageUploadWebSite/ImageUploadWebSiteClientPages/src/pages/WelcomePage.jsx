import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { drawAPI, userAPI } from "../api/api";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";
import MilestoneProgress from "../components/MilestoneProgress";
import './WelcomePage.css'

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

const WelcomePage = () => {
  const [userStats, setUserStats] = useState({ totalEntries: 0, rank: 0 });
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch both stats and profile
        const [stats, profile] = await Promise.all([
          drawAPI.getUserPosition(),
          userAPI.getProfile()
        ]);
        setUserStats(stats);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUserProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
  };

  // Format number to always show 4 digits
  const formatEntryCount = (count) => {
    return String(count).padStart(4, '0').split('');
  };

  return (
    <div className="welcome-page">
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
      <main>
        <div className="welcome-title">
          Welcome to Gotta Scan Them All ™
        </div>
        <div className="welcome-intro">
          Your comprehensive platform for tracking your participation
          in our prize draws, designed to enhance your chances of
          winning your dream car. Each upload you submit grants you
          an entry into the free prize draw associated with your area or
          region. Reaching specific upload milestones entitles you to
          additional bonus entries:
        </div>
        
        <MilestoneProgress />
        <div className="entry-counts">
          32 uploads: 5 extra entries
          48 uploads: 10 extra entries
          96 uploads: 20 extra entries
        </div>
        <div className="welcome-content1">
          Uploading an identical image to multiple platforms is considered separate
          submissions, allowing you to reach milestones more efficiently. Your total
          number of uploads can be monitored via the personal calculator located at the
          bottom of the left-hand menu.<br />
          Our marketing partners provide the valuable prizes available on this platform.
          To maintain the integrity of the promotion, all images uploaded to your social
          media accounts must clearly depict you and correspond with your profile
          picture, alongside stationary vehicles. In the
          case of moving billboards a picture
          capturing
          the advertisement and unique surrounding
          background suffices, as
          your personal safety is
          paramount at all times.<br />
          While multiple uploads of the same image to different platforms are permitted
          and encouraged, uploading the same image multiple times to a single platform
          will result in account cancellation and forfeiture of any draw entries.
        </div>
        <div className="welcome-content2">
          Should you win a prize, your winning entry will undergo verification to ensure
          all uploads remain current and have not been altered by artificial means such as
          photo editing software.<br />
          Messages displayed on your personal page are sent by our partners in the
          "Gotta Scan Them All"™ promotion.<br />
          Stay attentive for additional partner marketing in your area from our partners
          in these messages to increase your opportunities for submission and enhance
          your chances of winning.
        </div>
        <div className="prize-showcase">
          <img src="/assets/prizes/x-prize.png" alt="prize" />
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
      </main>
    </div>
  )
}

export default WelcomePage
