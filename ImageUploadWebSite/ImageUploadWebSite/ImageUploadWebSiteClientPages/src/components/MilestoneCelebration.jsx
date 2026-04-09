import './MilestoneCelebration.css';

const MilestoneCelebration = ({ milestone, onClose }) => {
  if (!milestone) return null;

  return (
    <div className="milestone-celebration-overlay" onClick={onClose}>
      <div className="milestone-celebration-modal" onClick={(e) => e.stopPropagation()}>
        <button className="celebration-close" onClick={onClose}>×</button>
        
        <div className="celebration-content">
          <div className="celebration-icon">🎉</div>
          <h2>Milestone Achieved!</h2>
          <div className="celebration-details">
            <div className="milestone-badge">
              <span className="badge-count">{milestone.uploadCount}</span>
              <span className="badge-label">Uploads</span>
            </div>
            <div className="celebration-message">
              <p className="milestone-description">{milestone.description}</p>
              <div className="bonus-award">
                <span className="award-icon">🎁</span>
                <span className="award-text">
                  You've earned <strong>+{milestone.bonusEntries} bonus entries</strong>!
                </span>
              </div>
            </div>
          </div>
          <button className="celebration-button" onClick={onClose}>
            Awesome!
          </button>
        </div>

        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#D91A2A', '#D4A017', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)]
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
