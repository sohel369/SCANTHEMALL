import './BlogPage.css'

const BlogPage = () => {
  return (
    <div className="blog-page">
      <div className='blog-card'>
        <svg className="svg1" viewBox="0 0 116 438" fill="none">
          <path d="M0 437.96L11.54 0H115.4" fill="#D4A017" />
        </svg>
        <svg className="svg2" viewBox="0 0 734 98" fill="none">
          <path d="M733.31 0V97.75L0 25.25" fill="#D91A2A" />
        </svg>
        <svg className="svg3" viewBox="0 0 826 513" fill="none">
          <path d="M825.3 512.44H0L110.62 0H825.3V512.44Z" fill="white" />
        </svg>
        <div className="blog-content">
          <div className="blog-title">Blog</div>
          <div className="blog-details"></div>
        </div>
      </div>
      <div className="blog-images grid-images">
        <div className="grid-image"></div>
        <div className="grid-image"></div>
        <div className="grid-image"></div>
        <div className="grid-image"></div>
      </div>
      <div className="prize-showcase">
        <img src="/assets/prizes/x-prize.png" alt="prize" />
        <svg className="svg1" viewBox="0 0 676 43" fill="none">
          <path d="M675.15 3.98999L0 42.46L245.21 9.04004L643.69 0L675.15 3.98999Z" fill="#D91A2A" />
        </svg>
        <svg className="svg2" viewBox="0 0 283 36" fill="none">
          <path d="M253.08 29.35L282.47 0L0 35.5399L253.08 29.35Z" fill="#D4A017" />
        </svg>
        <svg className="svg3" viewBox="0 0 675 35" fill="none">
          <path d="M0 0L674.21 6.13L351.35 34.39L0 0Z" fill="#D91A2A" />
        </svg>
        <svg className="svg4" viewBox="0 0 353 26" fill="none">
          <path d="M62.98 0L0 25.3101L352.04 10.14L62.98 0Z" fill="#D4A017" />
        </svg>
      </div>
    </div>
  )
}

export default BlogPage
