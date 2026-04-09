import { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import './AnalysisPage.css'

const categoryData = [
  { name: 'Luxury Vehicle', percentage: 66, color: '#CA0408' },
  { name: 'Category 2', percentage: 74, color: '#FECB17' },
  { name: 'Category 3', percentage: 45, color: '#3FD0E7' },
  { name: 'Category 4', percentage: 80, color: '#22A108' },
  { name: 'Category 5', percentage: 76, color: '#053267' }
]

const AnalysisPage = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userAPI.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUserProfile(prev => ({
      ...prev,
      profile_photo_url: newPhotoUrl
    }));
  };

  return (
    <div className="analysis-page">
      <div className="upload-photo-section">
        <div className="upload-photo-image">
          <ProfilePhotoUpload 
            currentPhotoUrl={userProfile?.profile_photo_url}
            onPhotoUpdate={handlePhotoUpdate}
          />
        </div>
        <div className="upload-label">Upload Photo</div>
      </div>
      <div className="analysis-main">
        <div className="analysis-intro">
          <img src="/assets/analysis-chart.png" alt="Analysis Chart" />
          <div className="analysis-intro-content">
            <svg className="svg1" viewBox="0 0 442 243" fill="none">
              <path d="M441.7 0L0 5.72998V239.89C153.04 244.76 277.05 241.93 441.7 234.17V0Z" fill="#1C2526" />
            </svg>
            <svg className="svg2" viewBox="0 0 501 28" fill="none">
              <path d="M500.73 21.16L336.36 0L0 27.81L500.73 21.16Z" fill="#D91A2A" />
            </svg>
            <svg className="svg3" viewBox="0 0 223 21" fill="none">
              <path d="M207.69 20.3L222.71 0L0 16.78L207.69 20.3Z" fill="#D4A017" />
            </svg>
            <svg className="svg4" viewBox="0 0 483 28" fill="none">
              <path d="M0 6.62L146.54 27.81L482.9 0L0 6.62Z" fill="#D91A2A" />
            </svg>
            <svg className="svg5" viewBox="0 0 207 21" fill="none">
              <path d="M4.19 0L0 20.25L206.8 3.42999L4.19 0Z" fill="#D4A017" />
            </svg>
            <div>
              This chart shows the number
              of advertisers in your area and
              your progress to “Catch them
              ALL” and <span><svg viewBox="0 0 235 22" fill="none">
                <path d="M234.89 0H0V21.28H234.89V0Z" fill="#D91A2A" />
              </svg><span>doubLe your prize </span></span>
              draw entries.
            </div>
          </div>
        </div>
        <div className="analysis-chart-card">
          <svg className="svg1" viewBox="0 0 874 352" fill="none">
            <path d="M873.15 344.1C534.03 351.52 215.15 355.81 0 344.1V13.91L772.72 0L873.15 9.33002V344.1Z" fill="white" />
          </svg>
          <svg className="svg2" viewBox="0 0 893 38" fill="none">
            <path d="M892.14 31.36L799.56 21.45L599.13 0L0 37.36L892.14 31.36Z" fill="#D91A2A" />
          </svg>
          <svg className="svg3" viewBox="0 0 397 29" fill="none">
            <path d="M370.08 28.87L396.7 0L0 22.4L370.08 28.87Z" fill="#D4A017" />
          </svg>
          <svg className="svg4" viewBox="0 0 893 38" fill="none">
            <path d="M0 6L92.58 15.9L293.01 37.3501L892.14 0L0 6Z" fill="#D91A2A" />
          </svg>
          <svg className="svg5" viewBox="0 0 397 29" fill="none">
            <path d="M26.62 0L0 28.86L396.7 6.46997L26.62 0Z" fill="#D4A017" />
          </svg>
          <div className="analysis-progress-bars">
            {
              categoryData.map(item => (
                <div className="analysis-progress-bar" key={item.name}>
                  <svg className="svg1" viewBox="0 0 645 37" fill="none">
                    <path d="M626.88 34.99H18.12C8.80999 34.99 1.25 27.44 1.25 18.12C1.25 8.80999 8.8 1.25 18.12 1.25H626.88C636.19 1.25 643.75 8.8 643.75 18.12C643.75 27.44 636.2 34.99 626.88 34.99Z" fill="#D8D8D8" stroke="white" strokeWidth="2.5" strokeMiterlimit="10" />
                  </svg>
                  <svg className="svg2" viewBox="0 0 645 37" fill="none">
                    <path d="M626.88 34.99H18.12C8.80999 34.99 1.25 27.44 1.25 18.12C1.25 8.80999 8.8 1.25 18.12 1.25H626.88C636.19 1.25 643.75 8.8 643.75 18.12C643.75 27.44 636.2 34.99 626.88 34.99Z" fill="white" stroke="#D8D8D8" strokeWidth="2.5" strokeMiterlimit="10" />
                  </svg>
                  <span className="category-name">{item.name}</span>
                  <div className="progress-div">
                    <div className="progress-svg-div" style={{ "--progress": item.percentage, "--color": item.color }}>
                    </div>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="analysis-chart-explanation">
          This above chart shows your individual position in the race for
          exciting prizes in your area. Continue to Scan and Upload and
          watch yourself move up in the various categories and maybe to
          the 1-100 chance of a luxury vehicle.
        </div>
        <div className="analysis-images grid-images">
          <div className="grid-image"></div>
          <div className="grid-image"></div>
          <div className="grid-image"></div>
          <div className="grid-image"></div>
        </div>
        <div className="prize-showcase">
          <img src="/assets/analysis-showcase.png" alt="Analysis Showcase" />
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
      </div>
    </div>
  )
}

export default AnalysisPage
