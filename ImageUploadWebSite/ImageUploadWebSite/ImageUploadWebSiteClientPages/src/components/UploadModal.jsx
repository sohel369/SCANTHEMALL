import { useState, useEffect } from 'react';
import { uploadAPI, authAPI } from '../api/api';
import countries from '../data/countries';
import MilestoneCelebration from './MilestoneCelebration';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose, platform, onSuccess }) => {
  const [formData, setFormData] = useState({
    image: null,
    country: '',
    city: '',
    wave: 'WAVE1'
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [milestoneAchieved, setMilestoneAchieved] = useState(null);

  // Load user profile to pre-fill country
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = authAPI.getCurrentUser();
        if (user) {
          // Try to get full profile
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
          const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const profile = await response.json();
            setUserProfile(profile);
            if (profile.country) {
              setFormData(prev => ({ ...prev, country: profile.country }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size must be less than 10MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.image) {
      setError('Please select an image');
      setLoading(false);
      return;
    }
    if (!formData.country) {
      setError('Please select a country');
      setLoading(false);
      return;
    }
    if (!formData.city) {
      setError('Please enter a city');
      setLoading(false);
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', formData.image);
      uploadFormData.append('platform', platform);
      uploadFormData.append('country', formData.country);
      uploadFormData.append('city', formData.city.toUpperCase().replace(/\s+/g, ''));
      uploadFormData.append('wave', formData.wave);

      const response = await uploadAPI.uploadImage(uploadFormData);
      
      setSuccess(`Upload successful! Entry number: ${response.entryNumber}`);
      
      // Check if milestone was achieved
      if (response.milestoneAchieved) {
        setMilestoneAchieved(response.milestoneAchieved);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, milestoneAchieved ? 3000 : 1500);
      } else {
        // Reset form after 2 seconds
        setTimeout(() => {
          setFormData({ image: null, country: userProfile?.country || '', city: '', wave: 'WAVE1' });
          setPreview(null);
          setSuccess('');
          onClose();
        }, 2000);
      }
      
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay" onClick={onClose}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Upload to {platform}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Select Image *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          {/* Country */}
          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <small>Where did you take this photo?</small>
          </div>

          {/* City */}
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., New York, London, Tokyo"
              required
            />
            <small>Enter the city where you found this billboard</small>
          </div>

          {/* Wave (optional, defaults to WAVE1) */}
          <div className="form-group">
            <label htmlFor="wave">Campaign Wave</label>
            <select
              id="wave"
              name="wave"
              value={formData.wave}
              onChange={handleInputChange}
            >
              <option value="WAVE1">Wave 1</option>
              <option value="WAVE2">Wave 2</option>
              <option value="WAVE3">Wave 3</option>
            </select>
            <small>Current campaign wave (usually Wave 1)</small>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload & Enter Draw'}
          </button>
        </form>

        <div className="modal-info">
          <p>📸 Upload a screenshot of your {platform} post showing the billboard</p>
          <p>🎟️ Each upload earns you one entry in the sweepstakes!</p>
          <p>⚠️ Daily limit: 15 uploads</p>
        </div>
      </div>
      
      {milestoneAchieved && (
        <MilestoneCelebration 
          milestone={milestoneAchieved}
          onClose={() => setMilestoneAchieved(null)}
        />
      )}
    </div>
  );
};

export default UploadModal;
