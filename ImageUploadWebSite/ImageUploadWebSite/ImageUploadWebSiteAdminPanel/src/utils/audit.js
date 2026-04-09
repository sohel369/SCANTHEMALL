import { auditAPI } from '../api/api.js';

/**
 * Helper function to log audit events from the frontend
 * @param {string} action - The action type (use AUDIT_ACTIONS constants)
 * @param {string} details - Details about the action
 */
export const logAuditEvent = async (action, details) => {
  try {
    await auditAPI.createAuditLog(action, details);
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

/**
 * Predefined audit action types for consistency
 */
export const AUDIT_ACTIONS = {
  // User management
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_ROLE_CHANGE: 'user_role_change',
  
  // Settings
  SETTINGS_UPDATE: 'settings_update',
  
  // Notifications
  NOTIFICATION_SEND: 'notification_send',
  NOTIFICATION_DELETE: 'notification_delete',
  
  // Pages
  PAGE_UPDATE: 'page_update',
  PAGE_CREATE: 'page_create',
  
  // Ads
  AD_CREATE: 'ad_create',
  AD_UPDATE: 'ad_update',
  AD_DELETE: 'ad_delete',
  AD_ACTIVATE: 'ad_activate',
  AD_DEACTIVATE: 'ad_deactivate',
  
  // Draws
  DRAW_CREATE: 'draw_create',
  DRAW_UPDATE: 'draw_update',
  DRAW_DELETE: 'draw_delete',
  DRAW_STATUS_CHANGE: 'draw_status_change',
  
  // Uploads
  UPLOAD_DELETE: 'upload_delete',
  UPLOAD_APPROVE: 'upload_approve',
  
  // Campaigns
  CAMPAIGN_CREATE: 'campaign_create',
  CAMPAIGN_UPDATE: 'campaign_update',
  CAMPAIGN_DELETE: 'campaign_delete',
  CAMPAIGN_APPROVE: 'campaign_approve',
  CAMPAIGN_REJECT: 'campaign_reject',
  
  // Billboards
  BILLBOARD_CREATE: 'billboard_create',
  BILLBOARD_UPDATE: 'billboard_update',
  BILLBOARD_DELETE: 'billboard_delete',
};

/**
 * Get a human-readable description for an action
 * @param {string} action - The action type
 * @returns {string} Human-readable description
 */
export const getActionDescription = (action) => {
  const descriptions = {
    [AUDIT_ACTIONS.USER_CREATE]: 'User Created',
    [AUDIT_ACTIONS.USER_UPDATE]: 'User Updated',
    [AUDIT_ACTIONS.USER_DELETE]: 'User Deleted',
    [AUDIT_ACTIONS.USER_ROLE_CHANGE]: 'User Role Changed',
    [AUDIT_ACTIONS.SETTINGS_UPDATE]: 'Settings Updated',
    [AUDIT_ACTIONS.NOTIFICATION_SEND]: 'Notification Sent',
    [AUDIT_ACTIONS.PAGE_UPDATE]: 'Page Updated',
    [AUDIT_ACTIONS.AD_CREATE]: 'Ad Created',
    [AUDIT_ACTIONS.AD_UPDATE]: 'Ad Updated',
    [AUDIT_ACTIONS.AD_DELETE]: 'Ad Deleted',
    [AUDIT_ACTIONS.DRAW_CREATE]: 'Draw Created',
    [AUDIT_ACTIONS.DRAW_UPDATE]: 'Draw Updated',
    [AUDIT_ACTIONS.DRAW_DELETE]: 'Draw Deleted',
  };
  
  return descriptions[action] || action.replace(/_/g, ' ').toUpperCase();
};
