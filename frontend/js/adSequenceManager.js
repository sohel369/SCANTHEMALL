class AdSequenceManager {
  constructor() {
    this.visitCountKey = 'gtsa_visit_count';
    this.lastVisitKey = 'gtsa_last_visit';
  }

  static SEQUENCE_STAGES = {
    stage1: {
      minVisits: 1, maxVisits: 3, name: 'Awareness',
      ads: [
        { id: 'awareness_1', title: 'Win $1000 Cash Instantly', subtitle: 'Enter our daily cash sweepstakes with zero friction.', cta: 'Enter Now' },
        { id: 'awareness_2', title: 'Drive Away in a Luxury Car', subtitle: 'Someone in your area will win. Why not you?', cta: 'See the Car' },
        { id: 'awareness_3', title: 'Free Daily Prize Draws', subtitle: 'No purchase necessary. Ever.', cta: 'Join the Squad' }
      ]
    },
    stage2: {
      minVisits: 4, maxVisits: 7, name: 'Consideration',
      ads: [
        { id: 'consideration_1', title: 'Choose Your Favorite Category', subtitle: 'Beauty, Automotive, or Tech? Tell us what you want to win.', cta: 'Select Category' },
        { id: 'consideration_2', title: 'Unlock Local Prizes', subtitle: 'We partner with brands right in your neighborhood.', cta: 'View Local Sponsors' },
        { id: 'consideration_3', title: 'Boost Your Odds', subtitle: 'Complete your demographic profile to unlock multipliers.', cta: 'Complete Profile' }
      ]
    },
    stage3: {
      minVisits: 8, maxVisits: 14, name: 'Conversion',
      ads: [
        { id: 'conversion_1', title: 'Complete Your Entry Today', subtitle: 'You are one step away from finalizing your ticket.', cta: 'Complete Entry' },
        { id: 'conversion_2', title: 'Multiply Your Entries 10x', subtitle: 'Refer friends to massively boost your chances.', cta: 'Refer a Friend' },
        { id: 'conversion_3', title: 'Upload Receipts for Bingo', subtitle: 'Play Billboard Bingo to earn instant rewards.', cta: 'Play Bingo' }
      ]
    },
    stage4: {
      minVisits: 15, maxVisits: Infinity, name: 'Retention & VIP',
      ads: [
        { id: 'retention_1', title: 'Last Chance to Enter', subtitle: 'The draw is closing soon. Don\'t miss out!', cta: 'Finalize Entry' },
        { id: 'retention_2', title: 'VIP Exclusive Rewards', subtitle: 'As a frequent player, you have unlocked a bonus multiplier.', cta: 'Claim Bonus' }
      ]
    }
  };

  async initAndRender(containerId) {
    let container = document.getElementById(containerId);

    // Auto-create container if missing
    if (!container) {
      const parent = document.querySelector('.max-w-4xl') || document.body;
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8';
      // Append right before the footer if body, or append to main
      parent.appendChild(container);
    }

    // We only want to record visits for authenticated users
    const token = localStorage.getItem('GTSA_SESSION_TOKEN');
    if (!token) return; // If not logged in, do nothing

    const visitCount = await this.recordVisit(token);
    const stage = this.getCurrentStage(visitCount);
    if (!stage) return;

    const adIndex = (visitCount - stage.minVisits) % stage.ads.length;
    const ad = stage.ads[adIndex];

    this.renderAd(container, stage, ad, visitCount);
  }

  async recordVisit(token) {
    let currentCount = parseInt(localStorage.getItem(this.visitCountKey) || '0', 10);
    const newCount = currentCount + 1;

    localStorage.setItem(this.visitCountKey, newCount);
    localStorage.setItem(this.lastVisitKey, new Date().toISOString());

    try {
      const response = await fetch('/api/user/record-visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visitCount: newCount, timestamp: new Date().toISOString() })
      });
      const data = await response.json();
      if (data.success && data.visitCount) {
        localStorage.setItem(this.visitCountKey, data.visitCount);
        return data.visitCount;
      }
    } catch (e) {
      console.error('Failed to sync visit:', e);
    }
    return newCount;
  }

  getCurrentStage(visitCount) {
    for (const [key, stage] of Object.entries(AdSequenceManager.SEQUENCE_STAGES)) {
      if (visitCount >= stage.minVisits && visitCount <= stage.maxVisits) {
        return { key, ...stage };
      }
    }
    return null;
  }

  renderAd(container, stage, ad, visitCount) {
    const progressWidth = Math.min((visitCount / 15) * 100, 100);
    const progressText = visitCount < 15 ?\`\$ {15 - visitCount} visits until VIP offer\` : 'VIP Member';

    if (!document.getElementById('ad-sequence-style')) {
      const style = document.createElement('style');
      style.id = 'ad-sequence-style';
      style.innerHTML = \`
        .ad-wrapper {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(225, 29, 72, 0.2);
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
          color: #f1f5f9;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .stage-badge {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; font-size: 0.875rem;
        }
        .stage-name {
          background: rgba(225, 29, 72, 0.2); color: #e11d48; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .visit-indicator { opacity: 0.7; font-size: 0.75rem; }
        .ad-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem 0; line-height: 1.3; }
        .ad-subtitle { font-size: 1rem; opacity: 0.8; margin: 0 0 1.5rem 0; line-height: 1.5; }
        .ad-cta {
          background: #e11d48; color: white; border: none; padding: 0.875rem 1.75rem; border-radius: 8px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.3);
        }
        .ad-cta:hover { background: #c41e3a; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(225, 29, 72, 0.4); }
        .stage-progress { border-top: 1px solid rgba(225, 29, 72, 0.2); padding-top: 1rem; margin-top: 2rem; }
        .progress-bar { width: 100%; height: 4px; background: rgba(225, 29, 72, 0.1); border-radius: 2px; overflow: hidden; margin-bottom: 0.75rem; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #e11d48, #ec4899); border-radius: 2px; transition: width 0.6s ease; }
        .progress-text { font-size: 0.85rem; opacity: 0.7; margin: 0; }
      \`;
      document.head.appendChild(style);
    }

    container.innerHTML = \`
      <div class="ad-wrapper">
        <div class="stage-badge">
          <span class="stage-name">\${stage.name}</span>
          <span class="visit-indicator">Visit \${visitCount}</span>
        </div>
        <div class="ad-content">
          <h3 class="ad-title">\${ad.title}</h3>
          <p class="ad-subtitle">\${ad.subtitle}</p>
          <button class="ad-cta" onclick="window.location.href='log_in_page_advertising_placeholder.html'">\${ad.cta}</button>
        </div>
        <div class="stage-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: \${progressWidth}%"></div>
          </div>
          <p class="progress-text">\${progressText}</p>
        </div>
      </div>
    \`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const manager = new AdSequenceManager();
  manager.initAndRender('sequential-ad-container');
});
