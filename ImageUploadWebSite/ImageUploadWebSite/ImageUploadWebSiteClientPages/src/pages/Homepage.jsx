import { useState } from 'react'
import { State } from 'country-state-city';
import { billboardAPI } from '../api/billboards'
import countries from '../data/countries'
import { sectors } from '../data/sectors'
import './HomePage.css'

const featureHighlights = [
  'Exciting new concept',
  'Your go-to spot for upping your chances to score that dream vehicle.',
  'Rack up uploads for bonus entries.',
  'Check your progress with our easy calculator.',
  'More uploads = More chances to win.'
]

const images = Array.from({ length: 36 }, (_, i) => i);

const HomePage = () => {
  const [searchData, setSearchData] = useState({
    country: '',
    state: '',
    postalCodes: ['', '', '', ''],
    sector: '',
    searchType: 'postal' // 'postal', 'sector', 'region', or 'general'
  })
  const [searchResults, setSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleInputChange = (field, value, index = null) => {
    if (field === 'postalCodes' && index !== null) {
      const newCodes = [...searchData.postalCodes]
      newCodes[index] = value
      setSearchData(prev => ({ ...prev, postalCodes: newCodes }))
    } else {
      setSearchData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      let results

      if (searchData.searchType === 'postal') {
        // Filter out empty postal codes
        const validCodes = searchData.postalCodes.filter(code => code.trim() !== '')
        if (validCodes.length === 0) {
          alert('Please enter at least one postal code')
          return
        }

        // If country/state filters are selected, use general search instead
        if (searchData.country.trim() || searchData.state.trim()) {
          const filters = { postal_codes: validCodes }
          if (searchData.country.trim()) {
            const countryObj = countries.find(c => c.iso2 === searchData.country)
            filters.country = countryObj ? countryObj.name : searchData.country
          }
          if (searchData.state.trim()) filters.state = searchData.state
          results = await billboardAPI.searchBillboards(filters)
        } else {
          results = await billboardAPI.searchByPostalCodes(validCodes)
        }
      } else if (searchData.searchType === 'sector') {
        if (!searchData.sector.trim()) {
          alert('Please enter a sector to search')
          return
        }

        // Apply country/state filters if selected in top dropdowns
        const filters = { sector: searchData.sector }
        if (searchData.country.trim()) {
          const countryObj = countries.find(c => c.iso2 === searchData.country)
          filters.country = countryObj ? countryObj.name : searchData.country
        }
        if (searchData.state.trim()) filters.state = searchData.state

        results = await billboardAPI.searchBillboards(filters)
      } else {
        // General search (combined filters)
        const filters = {}
        const validCodes = searchData.postalCodes.filter(code => code.trim() !== '')
        if (validCodes.length > 0) filters.postal_codes = validCodes
        if (searchData.sector.trim()) filters.sector = searchData.sector
        if (searchData.country.trim()) {
          // Convert country code to country name for search
          const countryObj = countries.find(c => c.iso2 === searchData.country)
          filters.country = countryObj ? countryObj.name : searchData.country
        }
        if (searchData.state.trim()) filters.state = searchData.state

        if (Object.keys(filters).length === 0) {
          alert('Please enter at least one search criteria')
          return
        }

        results = await billboardAPI.searchBillboards(filters)
      }

      setSearchResults(results)
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchTypeChange = (type) => {
    setSearchData(prev => ({ ...prev, searchType: type }))
    setShowResults(false)
  }

  return (
    <main className="homepage">
      <section className="hero-section">
        <svg className="hero-svg1" viewBox="0 0 1400 843" fill="none">
          <path d="M1400 779.82L0 842.57V0L1124.63 9.08L1400 11.3V779.82Z" fill="black" />
        </svg>
        <img className="hero-background-image" src="/assets/hero-background.png" alt="Hero Background" />
        <img className="hero-mobile-background-image" src="/assets/hero-mobile-background.png" alt="Hero Mobile Background" />
        <svg className="hero-svg2" viewBox="0 0 1209 83" fill="none">
          <path d="M1208.95 0L0 24.42L426.9 82.29L1208.95 0Z" fill="#D91A2A" />
        </svg>
        <svg className="hero-svg3" viewBox="0 0 390 82" fill="none">
          <path d="M0 0L389.57 45.64L387.18 76.64L297.67 81.53L0 0Z" fill="#D4A017" />
        </svg>
        <svg className="hero-svg4" viewBox="0 0 762 205" fill="none">
          <path d="M760.62 0L0 55.23L761.64 204.35L760.62 0Z" fill="#E0E0E0" />
        </svg>
        <svg className="hero-svg5" viewBox="0 0 565 155" fill="none">
          <path d="M564.01 154.22L0 46.52L563.77 0L564.01 154.22Z" fill="#D4A017" />
        </svg>
        <svg className="hero-svg6" viewBox="0 0 786 781" fill="none">
          <path d="M785.94 334.25L459.78 769.93L-9 780.55C-9.45 780.55 -11.04 765.45 -11.04 765L-9.42 200.07L-9.37 200.08L-8.77 0L398.37 4.38L785.94 334.25Z" fill="#D4A017" />
        </svg>
        <svg className="hero-svg8" viewBox="0 0 645 339" fill="none">
          <path d="M644.55 254.42L436.4 338.84L-0.36 228.43L0.29 -0.339996L398.36 14.98L644.55 254.42Z" fill="#1C2526" />
        </svg>
        <svg className="hero-svg9" viewBox="0 0 743 581" fill="none">
          <path d="M742.53 139.04L459.78 569.86L0.0599999 580.48C-0.39 580.48 -1.98 565.38 -1.98 564.93L-0.36 0L441.81 83.16L608.26 8.45999L742.53 139.04Z" fill="#E0E0E0" />
        </svg>
        <svg className="hero-svg7" viewBox="0 0 613 98" fill="none">
          <path d="M612.92 9.28L446.47 97.59L0 0L445.15 77.3L612.92 9.28Z" fill="#D91A2A" />
        </svg>
        <svg className="hero-svg11" viewBox="0 0 360 248" fill="none">
          <path opacity="0.6" d="M26.209 1.13954L-14.0403 -6.36113e-07L-12.3639 250.413L366.795 246.798L361.113 57.1377L119.926 13.1951L26.209 1.13954Z" fill="#1C2526" />
        </svg>
        <svg className="hero-svg10" viewBox="0 0 577 51" fill="none">
          <path d="M0 0V50.86L576.92 0H0Z" fill="#D4A017" />
        </svg>
        <h3 className="hero-title">
          Your Passport<br /> to Luxury Prizes.
          <svg viewBox="0 0 180 59" fill="none">
            <path d="M26.2312 1.09082C11.7212 13.3008 -10.6188 29.6908 9.35118 44.4308C36.2812 62.6008 122.791 59.5208 153.701 48.8308C182.481 40.0308 189.331 19.1108 154.831 11.1608C141.751 8.27083 128.651 7.46083 114.961 6.97083C79.4912 5.89083 43.7712 9.96082 12.5712 26.5308" stroke="#D4A017" />
          </svg>
        </h3>
        <ul className="feature-list">
          {featureHighlights.map((item) => (
            <li key={item} className="feature-item">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M8.57 3.29004C11.48 3.29004 13.85 5.66001 13.85 8.57001C13.85 11.48 11.48 13.85 8.57 13.85C5.66 13.85 3.29 11.48 3.29 8.57001C3.29 5.66001 5.66 3.29004 8.57 3.29004ZM8.57 0C3.84 0 0 3.84001 0 8.57001C0 13.3 3.84 17.14 8.57 17.14C13.3 17.14 17.14 13.3 17.14 8.57001C17.14 3.84001 13.3 0 8.57 0Z" fill="#D4A017" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="search-section" id="scan-search">
        <svg className="search-svg1" viewBox="0 0 1400 1052" fill="none">
          <path d="M1400 70.7V1051.12H736.61L577.6 470.53L720.06 82.29H0L1398.98 0V70.7H1400Z" fill="#D91A2A" />
        </svg>
        <svg className="search-svg2" viewBox="0 0 795 969" fill="none">
          <path d="M131.24 968.83H794.63V0L177.59 1.16992L0 388.24L131.24 968.83Z" fill="#E0E0E0" />
        </svg>
        <img className="search-background-image" src="/assets/search-background.png" alt="Search Background" />
        <svg className="search-svg3" viewBox="0 0 766 969" fill="none">
          <path opacity="0.77" d="M102.33 968.83H765.72V0L195.37 1.16992L0 388.24L102.33 968.83Z" fill="#1C2526" />
        </svg>
        <svg className="search-mobilesvg1" viewBox="0 0 360 65" fill="none">
          <path d="M360.045 22.4654V65L318.5 47L278 38.5H223.5L-84.813 26.1482L359.721 0V22.4654H360.045Z" fill="#D91A2A" />
        </svg>
        <img className="search-mobile-background-image" src="/assets/search-mobile-background.png" alt="Search Mobile Background" />
        <svg className="search-mobilesvg2" viewBox="0 0 360 317" fill="none">
          <path opacity="0.6" d="M-7.20021 0H366L365 317H-5.5L-7.20021 0Z" fill="#1C2526" />
        </svg>
        <div className="search-description">
          <div className="search-description-heading">
            Scan One Advertiser from Each Sector to Recieve A Double Bonus Entry Award.
            <svg viewBox="0 0 167 51" fill="none">
              <path d="M24.0481 1.00549C10.6781 11.3255 -9.92192 25.1654 8.72808 37.9354C33.8681 53.6954 114.138 51.7655 142.738 42.8755C169.378 35.5855 175.558 17.7454 143.478 10.6654C131.318 8.08541 119.148 7.29549 106.438 6.75549C73.5081 5.53549 40.3881 8.7354 11.5681 22.6554" stroke="#D4A017" />
            </svg>
          </div>
          <img className="search-logo-image" src="/assets/search-logo.png" alt="Search Logo" />
          <div className="search-description-content">
            If you are able to Scan one advertiser from each sector in your area, you will automatically earn a fabulous bonus. Watch your entire prize entry tickets double like magic! Now you've got twice the chances to snag those fabulous luxury prizes!
          </div>
        </div>
        <div className="section-divider-top">
          <svg className="svg1" viewBox="0 0 1399 83" fill="none">
            <path d="M1398.98 0H0V82.3L1398.98 0Z" fill="#D91A2A" />
          </svg>
          <svg className="svg2" viewBox="0 0 577 51" fill="none">
            <path d="M576.92 50.8601V0L0 50.8601H576.92Z" fill="#D4A017" />
          </svg>
        </div>
        <div className="search-panel centered-div">
          <div className="search-panel-one centered-div">
            <div className="country-search-dropdown">
              <select
                value={searchData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="">Country</option>
                {countries.map(country => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="state-search-dropdown">
              <select
                value={searchData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              >
                <option value="">Select State/Region</option>
                {State.getStatesOfCountry(searchData.country).map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="search-button clickable" onClick={handleSearch} disabled={loading}>
              <svg viewBox="0 0 165 56" fill="none">
                <path d="M157.07 55.54H7.07001C3.16001 55.54 0 52.37 0 48.47V7.06995C0 3.15995 3.17001 0 7.07001 0H157.07C160.98 0 164.14 3.16995 164.14 7.06995V48.47C164.14 52.37 160.97 55.54 157.07 55.54Z" fill="#F5E050" />
              </svg>
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
          <div className="search-panel-two centered-div">
            <div className="flex-between-div">
              <div className="postal-code-select-div select-div clickable" onClick={() => handleSearchTypeChange('postal')}>
                <svg viewBox="0 0 286 54" fill="none">
                  <path d="M258.21 53.98H26.99C12.08 53.98 0 41.9 0 26.99C0 12.08 12.08 0 26.99 0H258.21C273.12 0 285.2 12.08 285.2 26.99C285.2 41.89 273.11 53.98 258.21 53.98Z" fill="#D91A2A" />
                </svg>
                <span>Search By Zip or Postal Code</span>
              </div>
              <div className="advertiser-sector-select-div select-div clickable" onClick={() => handleSearchTypeChange('sector')}>
                <svg viewBox="0 0 286 54" fill="none">
                  <path d="M258.21 53.98H26.99C12.08 53.98 0 41.9 0 26.99C0 12.08 12.08 0 26.99 0H258.21C273.12 0 285.2 12.08 285.2 26.99C285.2 41.89 273.11 53.98 258.21 53.98Z" fill="#D91A2A" />
                </svg>
                <span>Search By Advertiser Sector</span>
              </div>
            </div>

            {searchData.searchType === 'postal' ? (
              <div className="postal-code-input-div">
                {searchData.postalCodes.map((code, index) => (
                  <div key={index}>
                    <svg viewBox="0 0 296 41" fill="none">
                      <path d="M278.42 40.2H17.23C7.72004 40.2 0 32.49 0 22.97V17.23C0 7.71998 7.71004 0 17.23 0H278.42C287.93 0 295.65 7.70998 295.65 17.23V22.97C295.65 32.48 287.93 40.2 278.42 40.2Z" fill="#EAEAEA" />
                    </svg>
                    <input
                      type="text"
                      placeholder={`Zip or Postal Code ${index + 1}`}
                      value={code}
                      onChange={(e) => handleInputChange('postalCodes', e.target.value, index)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="advertiser-sector-search-div">
                <div className="sector-search-dropdown">
                  <select
                    value={searchData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                  >
                    <option value="">Select Advertiser Sector</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button className="search-button clickable" onClick={handleSearch} disabled={loading}>
              <svg viewBox="0 0 165 56" fill="none">
                <path d="M157.07 55.54H7.07001C3.16001 55.54 0 52.37 0 48.47V7.06995C0 3.15995 3.17001 0 7.07001 0H157.07C160.98 0 164.14 3.16995 164.14 7.06995V48.47C164.14 52.37 160.97 55.54 157.07 55.54Z" fill="#F5E050" />
              </svg>
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {showResults && searchResults && (
        <section className="search-results-section">
          <div className="search-results-container">
            <h2 className="search-results-title">
              Search Results
            </h2>

            {/* Display results based on search type */}
            {searchData.searchType === 'postal' ? (
              <div className="postal-results">
                {Object.entries(searchResults).map(([postalCode, data]) => (
                  <div key={postalCode} className="result-card">
                    <h3 className="result-card-title">
                      Postal Code: {postalCode} ({data.total} billboards found)
                    </h3>

                    <div className="result-columns">
                      <div>
                        <h4 className="result-column-title new">
                          New Billboards (Under 3 months) - {data.new.length}
                        </h4>
                        {data.new.length > 0 ? (
                          <div className="billboard-list">
                            {data.new.map((billboard) => (
                              <div key={billboard.id} className="billboard-item">
                                <div className="billboard-company">{billboard.advertiser_company || billboard.advertiser_name}</div>
                                <div className="billboard-details">
                                  Created: {new Date(billboard.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-results">No new billboards in this area</div>
                        )}
                      </div>

                      <div>
                        <h4 className="result-column-title old">
                          Older Billboards (Over 3 months) - {data.old.length}
                        </h4>
                        {data.old.length > 0 ? (
                          <div className="billboard-list">
                            {data.old.map((billboard) => (
                              <div key={billboard.id} className="billboard-item">
                                <div className="billboard-company">{billboard.advertiser_company || billboard.advertiser_name}</div>
                                <div className="billboard-details">
                                  Created: {new Date(billboard.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="no-results">No older billboards in this area</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="general-results">
                <div className="result-card">
                  <h3 className="result-card-title">
                    {searchData.searchType === 'sector' && `Sector: ${searchResults.sector || searchData.sector}`}
                    {searchData.searchType === 'region' && `Region: ${searchData.country || 'Any Country'} ${searchData.state ? `- ${searchData.state}` : ''}`}
                    {searchData.searchType === 'general' && 'Combined Search Results'}
                    {' '}({searchResults.total || 0} billboards found)
                  </h3>

                  <div className="result-columns">
                    <div>
                      <h4 className="result-column-title new">
                        New Billboards (Under 3 months) - {(searchResults.new || []).length}
                      </h4>
                      {(searchResults.new || []).length > 0 ? (
                        <div className="billboard-list">
                          {(searchResults.new || []).map((billboard) => (
                            <div key={billboard.id} className="billboard-item">
                              <div className="billboard-company">{billboard.advertiser_company || billboard.advertiser_name}</div>
                              <div className="billboard-details">
                                Location: {billboard.postal_code} | Created: {new Date(billboard.created_at).toLocaleDateString()}
                              </div>
                              {billboard.first_name && billboard.last_name && (
                                <div className="billboard-contact">
                                  Contact: {billboard.first_name} {billboard.last_name}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-results">No new billboards found</div>
                      )}
                    </div>

                    <div>
                      <h4 className="result-column-title old">
                        Older Billboards (Over 3 months) - {(searchResults.old || []).length}
                      </h4>
                      {(searchResults.old || []).length > 0 ? (
                        <div className="billboard-list">
                          {(searchResults.old || []).map((billboard) => (
                            <div key={billboard.id} className="billboard-item">
                              <div className="billboard-company">{billboard.advertiser_company || billboard.advertiser_name}</div>
                              <div className="billboard-details">
                                Location: {billboard.postal_code} | Created: {new Date(billboard.created_at).toLocaleDateString()}
                              </div>
                              {billboard.first_name && billboard.last_name && (
                                <div className="billboard-contact">
                                  Contact: {billboard.first_name} {billboard.last_name}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-results">No older billboards found</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="close-results-container">
              <button
                onClick={() => setShowResults(false)}
                className="close-results-btn"
              >
                Close Results
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="video-section-divider section-divider-top">
        <svg className="svg1" viewBox="0 0 1399 83" fill="none">
          <path d="M1398.98 0H0V82.3L1398.98 0Z" fill="#D91A2A" />
        </svg>
        <svg className="svg2" viewBox="0 0 577 51" fill="none">
          <path d="M576.92 50.8601V0L0 50.8601H576.92Z" fill="#D4A017" />
        </svg>
      </div>

      <section className="video-section">
        <div className="video-wrapper">
          <img className="video-image" src="/assets/video.png" alt="Video Alternative" />
          <svg className="svg1" viewBox="0 0 1027 62" fill="none">
            <path d="M1026.68 36.78L713.8 0L0 61.5L1026.68 36.78Z" fill="#D91A2A" />
          </svg>
          <svg className="svg2" viewBox="0 0 424 38" fill="none">
            <path d="M423.08 37.2898V0L0 37.2898H423.08Z" fill="#D4A017" />
          </svg>
        </div>
      </section>

      <div className="section-divider-bottom">
        <svg className="svg1" viewBox="0 0 577 51" fill="none">
          <path d="M0 0V50.8601L576.92 6.47998L0 0Z" fill="#D4A017" />
        </svg>
        <svg className="svg2" viewBox="0 0 1399 73" fill="none">
          <path d="M0 72.3701H1398.98V0L0 72.3701Z" fill="#D91A2A" />
        </svg>
      </div>

      <section className="partners-section">
        <div className="centered-div">
          <div className="partners-heading">
            <svg viewBox="0 0 330 74" fill="none">
              <path d="M329.61 73.3701H31.52L0 0H298.09L329.61 73.3701Z" fill="#D4A017" />
            </svg>
            <span>Our Partners</span>
          </div>
          <div className="partners-logo-grid">
            {images.map((index) => (
              <img
                key={index}
                src="/assets/partner-logo.png"
                alt={`Partner Logo ${index}`}
                className="partner-logo-image"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider-top">
        <svg className="svg1" viewBox="0 0 1399 83" fill="none">
          <path d="M1398.98 0H0V82.3L1398.98 0Z" fill="#D91A2A" />
        </svg>
        <svg className="svg2" viewBox="0 0 577 51" fill="none">
          <path d="M576.92 50.8601V0L0 50.8601H576.92Z" fill="#D4A017" />
        </svg>
      </div>

      <section className="progress-section">
        <div className="progress-scale">
          <div className="progress-content">
            <div className="progress-heading">Monitor Your Progress</div>
            <div className="progress-description">Instantly see where your upload status rates in your quest for the car of your dreams</div>
          </div>
          <div className="progress-image-part">
            <img className="progress-image" src="/assets/progress-chart.png" alt="Progress Chart" />
            <img className="arrow-image" src="/assets/arrow.png" alt="Arrow Image" />
          </div>
        </div>
        <div className="billboard-part">
          <div className="billboard-description">
            Simply Scan and Upload our partners Mobile Billboards
          </div>
          <div className="billboard-image">
            <img className="billboard-image" src="/assets/billboard.png" alt="Bill Board Image" />
            <svg className="svg1" viewBox="0 0 467 43" fill="none">
              <path d="M345 0L0 42.5L466.5 26L345 0Z" fill="#D91A2A" />
            </svg>
            <svg className="svg2" viewBox="0 0 198 26" fill="none">
              <path d="M0 21.5L197.5 0V25.5L0 21.5Z" fill="#D4A017" />
            </svg>
            <svg className="svg3" viewBox="0 0 198 26" fill="none">
              <path d="M197.5 4L0 25.5V0L197.5 4Z" fill="#D4A017" />
            </svg>
            <svg className="svg4" viewBox="0 0 467 43" fill="none">
              <path d="M121.5 42.5L466.5 0L0 16.5L121.5 42.5Z" fill="#D91A2A" />
            </svg>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="story-card">
          <svg className="svg1" viewBox="0 0 1369 319" fill="none">
            <path d="M65.5737 317.616L1.6641 1.36133H1302.75L1366.65 317.606H65.5737V317.616Z" fill="white" stroke="#CECECE" />
          </svg>
          <svg className="svg2" viewBox="0 0 360 320" fill="none">
            <path d="M33 319.187L-9.63702 0.687031L331.5 0.687012L373.702 319.187H33Z" fill="white" stroke="#CECECE" strokeWidth="1.37379" strokeMiterlimit="10" />
          </svg>
          <div className="about-billboard">
            <span className="red-text">Get ready for an electrifying adventure with Mobile Billboards from our partners in the exhilarating Gotta Scan Them All ™
              event!</span><br />
            These billboards are popping up all over the city with vibrant designs and messages that scream for your attention. Every week, new
            partners join the fun, adding fresh, eye-popping messages to amplify your excitement!
          </div>
          <div className="about-socialmedia">
            <span className="red-text">Unleash your inner social media star! Snap a selfie with the billboards you discover and spice it up with a hilarious caption.</span><br />
            Challenge your friends to join the fun and see who can uncover the quirkiest billboards in town !
          </div>
          <div>
            <span className="red-text">Track your progress and rise up the Sweepstakes leaderboard. Every scan nudges you closer to glory and epic prizes.</span><br />
            Celebrate your victories, aim for the top spot, and let the competition heat up as you race to scan more!
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
