import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Country, State } from 'country-state-city';
import { authAPI } from '../api/api.js'
import countries from '../data/countries.json'
import './SignUpPage.css'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dateOfBirth: '',
    postalCode: '',
    username: '',
    mobileNumber: '',
    gender: '',
    country: '',
    stateRegion: '',
    areaCode: '',
    agreeToTerms: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    // If country is changed, automatically update the area code
    if (name === 'country') {
      const selectedCountry = Country.getCountryByCode(value)
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        areaCode: selectedCountry ? selectedCountry.phonecode : '',
        stateRegion: '' // Reset state when country changes
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms and Conditions')
      setLoading(false)
      return
    }

    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        role: 'user',
        username: formData.username,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        postalCode: formData.postalCode,
        country: formData.country,
        stateRegion: formData.stateRegion,
        areaCode: formData.areaCode,
        mobileNumber: formData.mobileNumber,
      })
      // Redirect to welcome/login page after successful registration
      navigate('/welcome?registered=true')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="geometric-background">
          <svg className="svg1" viewBox="0 0 1399 882" fill="none">
            <path d="M1398.75 878.07L1397.75 73.99L485.89 0L0 27V842.72C196.94 849.05 871.21 893.76 1398.75 878.07Z" fill="#1C2526" />
          </svg>
          <svg className="svg2" viewBox="0 0 1171 78" fill="none">
            <path d="M0 43.41L1170.57 77.36L425.97 0L69.84 36.3L0 43.41Z" fill="#D91A2A" />
          </svg>
          <svg className="svg3" viewBox="0 0 576 45" fill="none">
            <path d="M0 44.02V0L575.99 44.02H0Z" fill="#D4A017" />
          </svg>
          <svg className="svg4" viewBox="0 0 1170 83" fill="none">
            <path d="M1169.98 45.2999L1160.48 44.9299L0 0L814.82 83L1169.98 45.2999Z" fill="#D91A2A" />
          </svg>
          <svg className="svg5" viewBox="0 0 474 54" fill="none">
            <path d="M473.13 53.4801L0 0V48.7001L473.13 53.4801Z" fill="#D4A017" />
          </svg>

          <svg className="mobile-svg1" viewBox="0 0 360 540" fill="none">
            <path d="M398.687 537.5V38.9515L113.15 0L-39 14.2139L-39.3131 518.89C22.356 522.223 233.495 545.76 398.687 537.5Z" fill="#1C2526" />
          </svg>
          <svg className="mobile-svg2" xmlns="http://www.w3.org/2000/svg" width="320" height="31" viewBox="0 0 320 31" fill="none">
            <path d="M-10 13.4674L319.5 30.5L112.27 0L10.0469 11.2616L-10 13.4674Z" fill="#D91A2A" />
          </svg>
          <svg className="mobile-svg3" xmlns="http://www.w3.org/2000/svg" width="155" height="17" viewBox="0 0 155 17" fill="none">
            <path d="M-10 13V0L155 16.5L-10 13Z" fill="#D4A017" />
          </svg>
          <svg className="mobile-svg4" xmlns="http://www.w3.org/2000/svg" width="289" height="26" viewBox="0 0 289 26" fill="none">
            <path d="M366.361 14.185L363.386 14.0691L0 0L255.148 25.9902L366.361 14.185Z" fill="#D91A2A" />
          </svg>
          <svg className="mobile-svg5" xmlns="http://www.w3.org/2000/svg" width="173" height="19" viewBox="0 0 173 19" fill="none">
            <path d="M173 19L-3 0V17.3018L173 19Z" fill="#D4A017" />
          </svg>

          <div className="signup-form-panel">
            <div className="signup-form-header-panel">
              <div className="signup-form-header">
                <svg className="svg1" viewBox="0 0 452 63" fill="none">
                  <path d="M451.9 62.41H37.91L0 0H413.99L451.9 62.41Z" fill="#D4A017" />
                </svg>
                <svg className="svg2" viewBox="0 0 452 63" fill="none">
                  <path d="M451.89 62.4H37.9L0 0H413.99L451.89 62.4Z" fill="#D91A2A" />
                </svg>
                <span className="signup-form-title">User Registration</span>
              </div>
            </div>

            <div className="signup-form" >
              {error && (
                <div className="error-message" style={{
                  color: '#D91A2A',
                  padding: '10px',
                  marginBottom: '15px',
                  backgroundColor: '#ffe6e6',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <div className="signup-form-grid1">
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="password">Password</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="dateOfBirth">D.O.B</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      placeholder="D.O.B"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="postalCode">Postal or Zip Code</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      placeholder="Enter Postal or Zip Code"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="username">User Name</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="User Name"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="mobileNumber">Cell or Mobile Number</label>
                  <div>
                    <svg viewBox="0 0 248 50" fill="none">
                      <path d="M247.17 0H0V49.2H247.17V0Z" fill="#EDEDED" />
                    </svg>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      placeholder="Cell or Mobile Number"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="signup-form-grid2">
                <div className="dropdown-field">
                  <label htmlFor="gender">Gender</label>
                  <div className="custom-select">
                    <svg viewBox="0 0 165 26" fill="none">
                      <path d="M0 0V25.16L164.23 6.64001H14.29" fill="#D4A017" />
                    </svg>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="dropdown-field">
                  <label htmlFor="country">Country</label>
                  <div className="custom-select">
                    <svg viewBox="0 0 165 26" fill="none">
                      <path d="M0 0V25.16L164.23 6.64001H14.29" fill="#D4A017" />
                    </svg>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Country</option>
                      {countries.map(country => (
                        <option key={country.iso2} value={country.iso2}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="dropdown-field">
                  <label htmlFor="stateRegion">State/County/Region</label>
                  <div className="custom-select state-select">
                    <svg viewBox="0 0 165 26" fill="none">
                      <path d="M0 0V25.16L164.23 6.64001H14.29" fill="#D4A017" />
                    </svg>
                    <select
                      id="stateRegion"
                      name="stateRegion"
                      value={formData.stateRegion}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">State/County/Region</option>
                      {State.getStatesOfCountry(formData.country).map((state) => (
                        <option key={state.name} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="dropdown-field">
                  <label htmlFor="areaCode">Tel. Area Code</label>
                  <div className="custom-select">
                    <svg viewBox="0 0 165 26" fill="none">
                      <path d="M0 0V25.16L164.23 6.64001H14.29" fill="#D4A017" />
                    </svg>
                    <select
                      id="areaCode"
                      name="areaCode"
                      value={formData.areaCode}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Tel. Area Code</option>
                      {countries.map(country => (
                        <option key={country.iso2 + country.phonecode} value={country.phonecode}>
                          {`(+${country.phonecode}) ${country.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="terms-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                <span className="terms-text">
                  I have read and agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="notification-banner">
          <div className="notification-banner-title">
            <svg viewBox="0 0 519 32" fill="none">
              <path d="M518.67 31.735H8.955L0 0H448.865H509.72L518.67 31.735Z" fill="#D91A2A" />
            </svg>
            <span>Winners will be notified by Email and/Or SMS</span>
          </div>
          <div className="notification-banner-content">
            At our company, we deeply value your privacy and strive to protect it. To ensure your
            information is secure, we implement a double opt-in process for all our users. Once you
            complete your registration, you will receive an email at the address you provided. This
            email contains a unique link that you need to click to confirm your registration. By doing
            this, you not only validate your account but also become eligible to participate in exciting
            prize draws and exclusive offers. This extra step ensures that only you have control over
            your subscriptions, enhancing your privacy and security online. We appreciate your
            understanding and cooperation in keeping your information safe.
          </div>
        </div>

        <div className="promo-section">
          <div className="register-submit-button" onClick={handleSubmit} disabled={loading}>
            <svg viewBox="0 0 394 44" fill="none">
              <path d="M393.01 43.9H6.785L0 0H340.115H386.225L393.01 43.9Z" fill="#D91A2A" />
            </svg>
            <span>{loading ? 'Registering...' : 'Confirm Your Registration'}</span>
          </div>

          <div className="promo-image-section">
            <img src="/assets/register-promo-image.png" alt="Promo Image" className="promo-image" />
            <svg className="svg1" viewBox="0 0 700 31" fill="none">
              <path d="M699.88 26.0751L0 30.615L486.59 0L664.91 21.8L699.88 26.0751Z" fill="#D91A2A" />
            </svg>
            <svg className="svg2" viewBox="0 0 289 27" fill="none">
              <path d="M288.405 26.4399V0L0 26.4399H288.405Z" fill="#D4A017" />
            </svg>
            <svg className="svg3" viewBox="0 0 700 39" fill="none">
              <path d="M0 15.67L699.88 0L456.585 19.495L213.29 38.99L34.97 19.495L0 15.67Z" fill="#D91A2A" />
            </svg>
            <svg className="svg4" viewBox="0 0 289 24" fill="none">
              <path d="M0 4.88V23.645L288.405 0L0 4.88Z" fill="#D4A017" />
            </svg>
          </div>
          <div className="promo-text">
            Hyperlink to Details of Prize and Date of Draw Anchor on Terms and Conditions Page
          </div>
        </div>
      </div>
      <div className="register-advertising-panel">
      </div>
    </main>
  )
}

export default SignUp
