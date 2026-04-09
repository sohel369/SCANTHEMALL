import { useState, useEffect } from 'react';
import { bonusAPI } from '../api/api';
import './MilestoneProgress.css';

const MilestoneProgress = () => {
  const [milestoneData, setMilestoneData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const data = await bonusAPI.getMilestones();
      setMilestoneData(data);
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="milestone-progress loading">
        <div className="milestone-spinner"></div>
      </div>
    );
  }

  if (!milestoneData) return null;

  const { currentUploads, nextMilestone, completedMilestones, totalBonusEntries, progress } = milestoneData;

  return (
    <div className="milestone-progress">
      <div className="milestone-header">
        <h3>🎯 Milestone Progress</h3>
        <div className="bonus-entries-badge">
          +{totalBonusEntries} Bonus Entries Earned
        </div>
      </div>

      {nextMilestone ? (
        <div className="next-milestone">
          <div className="milestone-info">
            <div className="milestone-target">
              <span className="current-count">{currentUploads}</span>
              <span className="separator">/</span>
              <span className="target-count">{nextMilestone.upload_count}</span>
              <span className="uploads-label">uploads</span>
            </div>
            <div className="milestone-reward">
              <span className="reward-icon">🎁</span>
              <span className="reward-text">
                +{nextMilestone.bonus_entries} bonus entries
              </span>
            </div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <span className="progress-text">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="uploads-remaining">
              {nextMilestone.upload_count - currentUploads} more uploads to go!
            </div>
          </div>

          <div className="milestone-description">
            {nextMilestone.description}
          </div>
        </div>
      ) : (
        <div className="all-milestones-complete">
          <span className="trophy-icon">🏆</span>
          <h4>All Milestones Complete!</h4>
          <p>You've achieved legendary status with {currentUploads} uploads!</p>
        </div>
      )}

      {completedMilestones.length > 0 && (
        <div className="completed-milestones">
          <h4>Completed Milestones</h4>
          <div className="milestone-list">
            {completedMilestones.map((milestone) => (
              <div key={milestone.id} className="milestone-item completed">
                <div className="milestone-check">✓</div>
                <div className="milestone-details">
                  <span className="milestone-count">{milestone.upload_count} uploads</span>
                  <span className="milestone-bonus">+{milestone.entries_awarded} entries</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneProgress;
