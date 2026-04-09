import { useState, useEffect } from 'react';
import './PrivacyPage.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const PrivacyPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrivacy() {
      try {
        const response = await fetch(`${API_BASE_URL}/pages`);
        if (!response.ok) throw new Error('Failed to fetch privacy policy');
        const pages = await response.json();
        const privacyPage = pages.find(page => page.slug === 'privacy');
        if (privacyPage) {
          setContent(privacyPage);
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPrivacy();
  }, []);

  if (loading) {
    return (
      <div className="privacy-page">
        <div className="privacy-hero">
          <div className="privacy-badge">
            <svg className="svg1" viewBox="0 0 430 78" fill="none">
              <path d="M35.23 0L0 77.21H429.78L394.87 46.56" fill="#D4A017" />
            </svg>
            <svg className="svg2" viewBox="0 0 453 80" fill="none">
              <path d="M452.91 57.14L16.36 79.11L0 0H425.02L452.91 57.14Z" fill="#D91A2A" />
            </svg>
            <span>Privacy Policy</span>
          </div>
        </div>
        <div className="privacy-content">
          <div className="loading-message">Loading privacy policy...</div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="privacy-page">
        <div className="privacy-hero">
          <div className="privacy-badge">
            <svg className="svg1" viewBox="0 0 430 78" fill="none">
              <path d="M35.23 0L0 77.21H429.78L394.87 46.56" fill="#D4A017" />
            </svg>
            <svg className="svg2" viewBox="0 0 453 80" fill="none">
              <path d="M452.91 57.14L16.36 79.11L0 0H425.02L452.91 57.14Z" fill="#D91A2A" />
            </svg>
            <span>Privacy Policy</span>
          </div>
        </div>
        <div className="privacy-content">
          <div className="error-message">
            Unable to load privacy policy. Please try again later or contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <div className="privacy-badge">
          <svg className="svg1" viewBox="0 0 430 78" fill="none">
            <path d="M35.23 0L0 77.21H429.78L394.87 46.56" fill="#D4A017" />
          </svg>
          <svg className="svg2" viewBox="0 0 453 80" fill="none">
            <path d="M452.91 57.14L16.36 79.11L0 0H425.02L452.91 57.14Z" fill="#D91A2A" />
          </svg>
          <span>{content.title}</span>
        </div>
      </div>

      <div className="privacy-content">
        <div 
          className="dynamic-content"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </div>
  );
};

export default PrivacyPage;
