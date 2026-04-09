import { useState, useEffect } from 'react';
import { drawAPI, authAPI } from '../api/api';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [draws, setDraws] = useState([]);
  const [selectedDraw, setSelectedDraw] = useState('global');
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authAPI.getCurrentUser();
    setCurrentUser(user);
    fetchDraws();
  }, []);

  useEffect(() => {
    if (selectedDraw) {
      fetchLeaderboard();
    }
  }, [selectedDraw]);

  const fetchDraws = async () => {
    try {
      const drawsData = await drawAPI.getDraws();
      setDraws(drawsData);
    } catch (error) {
      console.error('Failed to fetch draws:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      if (selectedDraw === 'global') {
        // For global leaderboard, we'll use the first draw's endpoint
        // In a real implementation, you'd have a dedicated global endpoint
        const allDraws = await drawAPI.getDraws();
        if (allDraws.length > 0) {
          const data = await drawAPI.getLeaderboard(allDraws[0].id);
          setLeaderboardData(data);
        }
      } else {
        const data = await drawAPI.getLeaderboard(selectedDraw);
        setLeaderboardData(data);
      }

      // Fetch current user's position
      const stats = await drawAPI.getUserPosition();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: '🥇', class: 'gold', label: 'Gold' };
    if (rank === 2) return { emoji: '🥈', class: 'silver', label: 'Silver' };
    if (rank === 3) return { emoji: '🥉', class: 'bronze', label: 'Bronze' };
    return { emoji: '', class: '', label: '' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isCurrentUser = (userId) => {
    return currentUser && currentUser.id === userId;
  };

  const getNextRankInfo = () => {
    if (!userStats || !leaderboardData.length) return null;
    
    const currentRank = userStats.rank;
    const currentEntries = userStats.totalEntries;
    
    if (currentRank === 1) {
      return { message: "You're #1! Keep it up!", entriesNeeded: 0 };
    }

    // Find the user above current user
    const userAbove = leaderboardData.find((_, index) => index + 1 === currentRank - 1);
    if (userAbove) {
      const entriesNeeded = userAbove.entry_count - currentEntries + 1;
      return {
        message: `${entriesNeeded} more ${entriesNeeded === 1 ? 'entry' : 'entries'} to reach rank #${currentRank - 1}`,
        entriesNeeded,
        progress: (currentEntries / userAbove.entry_count) * 100
      };
    }

    return null;
  };

  const nextRankInfo = getNextRankInfo();

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Compete with others and climb to the top!</p>
      </div>

      {/* User Stats Card */}
      {userStats && (
        <div className="user-stats-card">
          <div className="user-stats-content">
            <div className="user-rank-display">
              <div className="rank-circle">
                <span className="rank-number">#{userStats.rank}</span>
              </div>
              <div className="rank-info">
                <h3>Your Rank</h3>
                <p>{userStats.totalEntries} {userStats.totalEntries === 1 ? 'entry' : 'entries'}</p>
              </div>
            </div>
            
            {nextRankInfo && nextRankInfo.entriesNeeded > 0 && (
              <div className="next-rank-info">
                <p className="next-rank-message">{nextRankInfo.message}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(nextRankInfo.progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {userStats.rank === 1 && (
              <div className="champion-badge">
                <span className="champion-emoji">👑</span>
                <span className="champion-text">Current Champion!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Draw Filter */}
      <div className="leaderboard-controls">
        <div className="draw-selector">
          <label htmlFor="draw-select">Filter by Draw:</label>
          <select
            id="draw-select"
            value={selectedDraw}
            onChange={(e) => setSelectedDraw(e.target.value)}
            className="draw-select"
          >
            <option value="global">🌍 Global Leaderboard</option>
            {draws.map(draw => (
              <option key={draw.id} value={draw.id}>
                {draw.name} - {draw.city}, {draw.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#D7D7DD" strokeWidth="2"/>
            <path d="M32 20v24M20 32h24" stroke="#D7D7DD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Entries Yet</h3>
          <p>Be the first to enter this draw!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="leaderboard-table-container desktop-view">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="rank-col">Rank</th>
                  <th className="user-col">User</th>
                  <th className="entries-col">Entries</th>
                  <th className="last-entry-col">Last Entry</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user, index) => {
                  const rank = index + 1;
                  const badge = getRankBadge(rank);
                  const isCurrent = isCurrentUser(user.user_id);

                  return (
                    <tr 
                      key={user.user_id} 
                      className={`${badge.class} ${isCurrent ? 'current-user' : ''}`}
                    >
                      <td className="rank-col">
                        <div className="rank-display">
                          {badge.emoji && <span className="rank-emoji">{badge.emoji}</span>}
                          <span className="rank-number">#{rank}</span>
                        </div>
                      </td>
                      <td className="user-col">
                        <div className="user-info">
                          <span className="user-email">
                            {user.email}
                            {isCurrent && <span className="you-badge">You</span>}
                          </span>
                        </div>
                      </td>
                      <td className="entries-col">
                        <span className="entry-count">{user.entry_count}</span>
                      </td>
                      <td className="last-entry-col">
                        {formatDate(user.last_entry)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="leaderboard-cards-container mobile-view">
            {leaderboardData.map((user, index) => {
              const rank = index + 1;
              const badge = getRankBadge(rank);
              const isCurrent = isCurrentUser(user.user_id);

              return (
                <div 
                  key={user.user_id} 
                  className={`leaderboard-card ${badge.class} ${isCurrent ? 'current-user' : ''}`}
                >
                  <div className="card-rank">
                    {badge.emoji && <span className="rank-emoji">{badge.emoji}</span>}
                    <span className="rank-number">#{rank}</span>
                  </div>
                  <div className="card-content">
                    <div className="card-user">
                      {user.email}
                      {isCurrent && <span className="you-badge">You</span>}
                    </div>
                    <div className="card-stats">
                      <div className="stat">
                        <span className="stat-label">Entries:</span>
                        <span className="stat-value">{user.entry_count}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Last Entry:</span>
                        <span className="stat-value">{formatDate(user.last_entry)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top 3 Podium (Optional Visual) */}
          {leaderboardData.length >= 3 && (
            <div className="podium-container">
              <h3>🏆 Top 3 Champions</h3>
              <div className="podium">
                {/* 2nd Place */}
                <div className="podium-place second">
                  <div className="podium-rank">🥈</div>
                  <div className="podium-user">{leaderboardData[1]?.email.split('@')[0]}</div>
                  <div className="podium-entries">{leaderboardData[1]?.entry_count} entries</div>
                  <div className="podium-bar"></div>
                </div>
                
                {/* 1st Place */}
                <div className="podium-place first">
                  <div className="podium-rank">🥇</div>
                  <div className="podium-user">{leaderboardData[0]?.email.split('@')[0]}</div>
                  <div className="podium-entries">{leaderboardData[0]?.entry_count} entries</div>
                  <div className="podium-bar"></div>
                </div>
                
                {/* 3rd Place */}
                <div className="podium-place third">
                  <div className="podium-rank">🥉</div>
                  <div className="podium-user">{leaderboardData[2]?.email.split('@')[0]}</div>
                  <div className="podium-entries">{leaderboardData[2]?.entry_count} entries</div>
                  <div className="podium-bar"></div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardPage;
