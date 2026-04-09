import { useState, useEffect } from 'react';
import { drawAPI } from '../api/api';
import './EntryHistoryPage.css';

const EntryHistoryPage = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDraw, setFilterDraw] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 20;

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [entries, searchTerm, filterDraw, sortBy]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await drawAPI.getUserEntries();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...entries];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.entry_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.draw_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply draw filter
    if (filterDraw !== 'all') {
      filtered = filtered.filter(entry => entry.draw_name === filterDraw);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date-asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'entry-asc':
          return a.entry_number.localeCompare(b.entry_number);
        case 'entry-desc':
          return b.entry_number.localeCompare(a.entry_number);
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
    setCurrentPage(1);
  };

  const getUniqueDraws = () => {
    const draws = [...new Set(entries.map(entry => entry.draw_name))];
    return draws.filter(Boolean);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Entry Number', 'Draw Name', 'Country', 'City', 'Wave', 'Date'];
    const csvData = filteredEntries.map(entry => [
      entry.entry_number,
      entry.draw_name,
      entry.country,
      entry.city,
      entry.wave,
      formatDate(entry.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entry-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Statistics
  const totalEntries = entries.length;
  const entriesByDraw = entries.reduce((acc, entry) => {
    acc[entry.draw_name] = (acc[entry.draw_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="entry-history-page">
      <div className="entry-history-header">
        <h1>My Entry History</h1>
        <p>Track all your draw entries and participation history</p>
      </div>

      {/* Statistics Dashboard */}
      <div className="entry-stats">
        <div className="stat-card">
          <div className="stat-value">{totalEntries}</div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(entriesByDraw).length}</div>
          <div className="stat-label">Draws Entered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filteredEntries.length}</div>
          <div className="stat-label">Filtered Results</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="entry-controls">
        <div className="control-group">
          <input
            type="text"
            placeholder="Search by entry number or draw name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="control-group">
          <select
            value={filterDraw}
            onChange={(e) => setFilterDraw(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Draws</option>
            {getUniqueDraws().map(draw => (
              <option key={draw} value={draw}>{draw}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="entry-asc">Entry Number (A-Z)</option>
            <option value="entry-desc">Entry Number (Z-A)</option>
          </select>

          <button onClick={exportToCSV} className="export-btn" disabled={filteredEntries.length === 0}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10v3.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 10V2M8 10l3-3M8 10L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Entry Table */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your entries...</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="#D7D7DD" strokeWidth="2"/>
            <path d="M32 20v24M20 32h24" stroke="#D7D7DD" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Entries Found</h3>
          <p>
            {searchTerm || filterDraw !== 'all'
              ? 'Try adjusting your filters'
              : 'Start uploading to earn draw entries!'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="entry-table-container desktop-view">
            <table className="entry-table">
              <thead>
                <tr>
                  <th>Entry Number</th>
                  <th>Draw Name</th>
                  <th>Location</th>
                  <th>Wave</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="entry-number">{entry.entry_number}</td>
                    <td>{entry.draw_name}</td>
                    <td>{entry.city}, {entry.country}</td>
                    <td>{entry.wave}</td>
                    <td>{formatDate(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="entry-cards-container mobile-view">
            {currentEntries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div className="entry-card-header">
                  <span className="entry-number">{entry.entry_number}</span>
                  <span className="entry-date">{formatDate(entry.created_at)}</span>
                </div>
                <div className="entry-card-body">
                  <div className="entry-info">
                    <span className="label">Draw:</span>
                    <span className="value">{entry.draw_name}</span>
                  </div>
                  <div className="entry-info">
                    <span className="label">Location:</span>
                    <span className="value">{entry.city}, {entry.country}</span>
                  </div>
                  <div className="entry-info">
                    <span className="label">Wave:</span>
                    <span className="value">{entry.wave}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`page-btn ${currentPage === pageNumber ? 'active' : ''}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="page-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EntryHistoryPage;
