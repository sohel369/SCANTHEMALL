import { useState, useEffect } from 'react';
import './TermsPage.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const TermsPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTerms() {
      try {
        const response = await fetch(`${API_BASE_URL}/pages`);
        if (!response.ok) throw new Error('Failed to fetch terms');
        const pages = await response.json();
        const termsPage = pages.find(page => page.slug === 'terms');
        if (termsPage) {
          setContent(termsPage);
        }
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTerms();
  }, []);

  if (loading) {
    return (
      <div className="terms-page">
        <div className="terms-hero">
          <div className="terms-badge">
            <svg className="svg1" viewBox="0 0 479 78" fill="none">
              <path d="M39.26 0L0 77.21H478.98L440.08 46.56" fill="#D4A017" />
            </svg>
            <svg className="svg2" viewBox="0 0 505 80" fill="none">
              <path d="M504.76 57.14L18.23 79.11L0 0H473.68L504.76 57.14Z" fill="#D91A2A" />
            </svg>
            <span>Terms and Conditions</span>
          </div>
        </div>
        <div className="terms-content">
          <div className="loading-message">Loading terms and conditions...</div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="terms-page">
        <div className="terms-hero">
          <div className="terms-badge">
            <svg className="svg1" viewBox="0 0 479 78" fill="none">
              <path d="M39.26 0L0 77.21H478.98L440.08 46.56" fill="#D4A017" />
            </svg>
            <svg className="svg2" viewBox="0 0 505 80" fill="none">
              <path d="M504.76 57.14L18.23 79.11L0 0H473.68L504.76 57.14Z" fill="#D91A2A" />
            </svg>
            <span>Terms and Conditions</span>
          </div>
        </div>
        <div className="terms-content">
          <div className="error-message">
            Unable to load terms and conditions. Please try again later or contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="terms-page">
      <div className="terms-hero">
        <div className="terms-badge">
          <svg className="svg1" viewBox="0 0 479 78" fill="none">
            <path d="M39.26 0L0 77.21H478.98L440.08 46.56" fill="#D4A017" />
          </svg>
          <svg className="svg2" viewBox="0 0 505 80" fill="none">
            <path d="M504.76 57.14L18.23 79.11L0 0H473.68L504.76 57.14Z" fill="#D91A2A" />
          </svg>
          <span>{content.title}</span>
        </div>
      </div>

      <div className="terms-content">
        <div 
          className="dynamic-content"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </div>
    </div>
  );
};

export default TermsPage;
