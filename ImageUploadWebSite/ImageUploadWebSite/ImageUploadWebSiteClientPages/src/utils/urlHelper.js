/**
 * URL Helper Utilities
 * 
 * Centralized URL construction for accessing backend static files.
 * Handles the conversion from API URL (with /api) to base URL (without /api).
 * 
 * Example:
 * - VITE_API_BASE_URL: https://api.scanthemall.com/api
 * - Base URL: https://api.scanthemall.com
 * - Upload URL: https://api.scanthemall.com/uploads/filename.jpg
 */

/**
 * Get the base URL for the API server (without /api suffix)
 * @returns {string} Base URL for accessing static files
 * 
 * @example
 * // VITE_API_BASE_URL = "https://api.scanthemall.com/api"
 * getApiBaseUrl() // Returns: "https://api.scanthemall.com"
 */
export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  // Remove trailing /api if present using regex to match only at the end
  return apiUrl.replace(/\/api$/, '');
};

/**
 * Construct full URL for uploaded files
 * @param {string} path - Relative path from uploads directory (e.g., '/uploads/filename.jpg' or 'filename.jpg')
 * @returns {string|null} Full URL to the file, or null if path is empty
 * 
 * @example
 * getUploadUrl('/uploads/image.jpg') 
 * // Returns: "https://api.scanthemall.com/uploads/image.jpg"
 * 
 * getUploadUrl('image.jpg')
 * // Returns: "https://api.scanthemall.com/image.jpg"
 */
export const getUploadUrl = (path) => {
  if (!path) return null;
  const baseUrl = getApiBaseUrl();
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

/**
 * Construct full URL for profile photos
 * @param {string} photoUrl - Photo URL from database (e.g., '/uploads/profiles/photo.jpg')
 * @returns {string|null} Full URL to the profile photo, or null if photoUrl is empty
 * 
 * @example
 * getProfilePhotoUrl('/uploads/profiles/profile-1-123456.jpg')
 * // Returns: "https://api.scanthemall.com/uploads/profiles/profile-1-123456.jpg"
 */
export const getProfilePhotoUrl = (photoUrl) => {
  return getUploadUrl(photoUrl);
};
