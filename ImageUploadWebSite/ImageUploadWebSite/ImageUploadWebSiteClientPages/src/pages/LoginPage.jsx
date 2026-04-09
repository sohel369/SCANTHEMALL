import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/api.js'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await authAPI.login(formData.email, formData.password)
      navigate('/welcome')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
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

          <div className="login-form-panel">
            <div className="login-form-header-panel">
              <div className="login-form-header">
                <svg className="svg1" viewBox="0 0 452 63" fill="none">
                  <path d="M451.9 62.41H37.91L0 0H413.99L451.9 62.41Z" fill="#D4A017" />
                </svg>
                <svg className="svg2" viewBox="0 0 452 63" fill="none">
                  <path d="M451.89 62.4H37.9L0 0H413.99L451.89 62.4Z" fill="#D91A2A" />
                </svg>
                <span className="login-form-title">User Login</span>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="login-form-fields">
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <div>
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
              </div>

              <div className="login-actions">
                <button type="submit" className="login-submit-button" disabled={loading}>
                  <svg viewBox="0 0 394 44" fill="none">
                    <path d="M393.01 43.9H6.785L0 0H340.115H386.225L393.01 43.9Z" fill="#D91A2A" />
                  </svg>
                  <span>{loading ? 'Logging in...' : 'Login'}</span>
                </button>

                <div className="register-link">
                  Don't have an account? <Link to="/register">Register here</Link>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="login-info-banner">
          <div className="login-info-banner-title">
            <svg viewBox="0 0 519 32" fill="none">
              <path d="M518.67 31.735H8.955L0 0H448.865H509.72L518.67 31.735Z" fill="#D91A2A" />
            </svg>
            <span>Welcome Back!</span>
          </div>
          <div className="login-info-banner-content">
            Log in to access your account and continue participating in exciting prize draws. 
            Upload images, track your entries, and check your position on the leaderboard. 
            Your journey to winning amazing prizes continues here!
          </div>
        </div>

        <div className="promo-section">
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
            Check out the latest prizes and draw dates in our Terms and Conditions
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
