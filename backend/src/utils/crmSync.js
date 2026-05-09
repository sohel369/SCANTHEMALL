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
 * বায়ারের নির্দেশনা অনুযায়ী হাইব্রিড সিঙ্ক লজিক
 */
export const syncHybrid = async (formData) => {
  // ১. Copper-এ ডেটা সেভ করা (The Data Store)
  const copperResult = await syncToCopper(formData);
  
  // ২. Coffe.ai ট্রিগার করা (The AI Engager)
  try {
    const coffeApiKey = process.env.COFFE_API_KEY;
    
    // API Key না থাকলে আমরা মক লগ দেখাবো
    if (!coffeApiKey) {
      console.log('--- COFFE.AI MOCK TRIGGER (No API Key) ---');
      console.log('Payload:', {
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        age_group: formData.ageGroup,
        campaign_id: 'cash_draw_b2c_2026'
      });
      return copperResult;
    }

    await axios.post('https://api.coffe.ai/v1/trigger-campaign', {
      email: formData.email,
      phone: formData.phone,
      category: formData.category,
      age_group: formData.ageGroup,
      campaign_id: 'cash_draw_b2c_2026'
    }, {
      headers: { 'Authorization': `Bearer ${coffeApiKey}` }
    });
    
    console.log('Lead synced to Copper and Coffe.ai engagement triggered successfully.');
  } catch (error) {
    console.error('Coffe.ai trigger failed, but Copper sync succeeded:', error.message);
  }
  
  return copperResult;
};
