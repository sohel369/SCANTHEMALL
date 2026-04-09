import { useState } from 'react';
import { userAPI } from '../api/api';
import { getProfilePhotoUrl } from '../utils/urlHelper';
import './ProfilePhotoUpload.css';

const ProfilePhotoUpload = ({ currentPhotoUrl, onPhotoUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await userAPI.uploadProfilePhoto(formData);
      
      // Notify parent component
      if (onPhotoUpdate) {
        onPhotoUpdate(response.photoUrl);
      }

      // Clear preview after successful upload
      setTimeout(() => {
        setPreview(null);
      }, 1000);

    } catch (err) {
      setError(err.message || 'Failed to upload photo');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const displayPhotoUrl = preview || getProfilePhotoUrl(currentPhotoUrl);

  return (
    <div className="profile-photo-upload">
      <div className="photo-container">
        {displayPhotoUrl ? (
          <img 
            src={displayPhotoUrl} 
            alt="Profile" 
            className="profile-photo"
            onError={(e) => {
              console.error('Profile photo load error:', e.target.src);
              console.error('Current photo URL:', currentPhotoUrl);
            }}
          />
        ) : (
          <div className="photo-placeholder">
            <svg className="svg1" viewBox="0 0 162 162" fill="none">
              <path d="M157.66 80.54C157.66 97.5 152.19 113.17 142.91 125.9C128.89 145.15 106.18 157.65 80.5499 157.65C54.9099 157.65 32.2099 145.15 18.1899 125.9C8.90994 113.17 3.43994 97.49 3.43994 80.54C3.43994 37.95 37.9599 3.43001 80.5499 3.43001C123.13 3.43001 157.66 37.96 157.66 80.54Z" fill="#F3F2F7" />
              <path d="M80.5401 85.08C95.2916 85.08 107.25 73.1215 107.25 58.37C107.25 43.6185 95.2916 31.66 80.5401 31.66C65.7886 31.66 53.8301 43.6185 53.8301 58.37C53.8301 73.1215 65.7886 85.08 80.5401 85.08Z" fill="#D7D7DD" />
              <path d="M142.91 125.91C128.89 145.16 106.18 157.66 80.5499 157.66C54.9099 157.66 32.2099 145.16 18.1899 125.91C32.1999 106.66 54.9099 94.15 80.5499 94.15C106.19 94.15 128.9 106.66 142.91 125.91Z" fill="#D7D7DD" />
            </svg>
          </div>
        )}
        
        <label className="photo-edit-button" htmlFor="profile-photo-input">
          <svg className="edit-icon" viewBox="0 0 35 35" fill="none">
            <path d="M11.8613 29.0758L1.63135 32.8358L5.39134 22.6058L25.9413 2.05581C27.3913 0.605808 29.7414 0.605808 31.1814 2.05581L32.4014 3.27581C33.8514 4.72581 33.8514 7.07581 32.4014 8.51581L11.8613 29.0758Z" stroke="white" strokeWidth="1.9366" strokeMiterlimit="10" />
            <path d="M31.8011 2.6658L8.39111 26.0758" stroke="white" strokeWidth="1.9366" strokeMiterlimit="10" />
            <path d="M5.39111 22.6058L11.8611 29.0758" stroke="white" strokeWidth="1.9366" strokeMiterlimit="10" />
          </svg>
          {uploading && <div className="upload-spinner"></div>}
        </label>

        <input
          id="profile-photo-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </div>

      {error && <div className="photo-error">{error}</div>}
      {uploading && <div className="photo-uploading">Uploading...</div>}
    </div>
  );
};

export default ProfilePhotoUpload;
