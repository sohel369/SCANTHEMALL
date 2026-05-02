import axios from 'axios';

/**
 * Mock function to represent syncing data to Copper CRM
 */
const syncToCopper = async (formData) => {
  // In a real scenario, this would use Copper's API to create/update a lead.
  console.log('--- COPPER CRM SYNC ---');
  console.log('Syncing lead to Copper:', formData.email);
  return { success: true, copperId: 'COPPER_MOCK_ID_' + Date.now() };
};

/**
 * Hybrid Sync: Sends data to Copper first, then triggers Coffe.ai
 */
export const syncHybrid = async (formData) => {
  // 1. Sync to Copper (The Data Store)
  const copperResult = await syncToCopper(formData);
  
  // 2. Trigger Coffe.ai (The AI Engager)
  try {
    const coffeApiKey = process.env.COFFE_API_KEY || 'mock-api-key';
    
    console.log('--- COFFE.AI SYNC TRIGGERED ---');
    console.log('Payload:', {
      email: formData.email,
      phone: formData.phone,
      category: formData.category || 'Default',
      age_group: formData.ageGroup || 'Unknown',
      shopping_freq: formData.shoppingFreq || 'Unknown',
      campaign_id: 'cash_draw_b2c_2026'
    });

    if (coffeApiKey !== 'mock-api-key') {
      await axios.post('https://api.coffe.ai/v1/trigger-campaign', {
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        age_group: formData.ageGroup,
        shopping_freq: formData.shoppingFreq,
        campaign_id: 'cash_draw_b2c_2026'
      }, {
        headers: { 'Authorization': `Bearer ${coffeApiKey}` }
      });
      console.log('Real Coffe.ai API request sent.');
    } else {
      console.log('Using mock Coffe API key. Real request skipped.');
    }
    
    console.log('Lead synced to Copper and AI engagement triggered successfully.');
  } catch (error) {
    console.error('Coffe.ai trigger failed, but Copper sync succeeded:', error.message);
  }
  
  return copperResult;
};
