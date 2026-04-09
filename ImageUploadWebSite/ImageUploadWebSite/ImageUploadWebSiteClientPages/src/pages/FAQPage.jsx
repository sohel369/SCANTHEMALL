import './FAQPage.css'

const FAQPage = () => {
  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="faq-badge">
          <svg className="svg1" viewBox="0 0 276 78" fill="none">
            <path d="M22.6 0L0 77.21H275.75L253.35 46.56" fill="#D4A017" />
          </svg>
          <svg className="svg2" viewBox="0 0 291 80" fill="none">
            <path d="M290.59 57.14L10.5 79.11L0 0H272.7L290.59 57.14Z" fill="#D91A2A" />
          </svg>
          <span>FAQ'S</span>
        </div>
      </div>
      <div className="faq-intro">
        <div className="faq-intro-title">Gotta Scan Them All ™ - Frequently Asked Questions</div>
        <div className="faq-intro-content">Your guide to entries, uploads, milestones, prizes, safety, and more</div>
      </div>
      <div className="faq-content">
        <section className="faq-section">
          <div className="section-heading">General Participation</div>
          <div className="faq-item">
            <div className="question">How do I participate in the Gotta Scan Them All™ prize draws?</div>
            <div className="answer">To enter, simply upload an image to Gotta Scan Them All ™. Each upload earns you a free entry in your regional prize draw. The more images you upload, the better your chances of winning.</div>
          </div>
          <div className="faq-item">
            <div className="question">What kind of images can I upload?</div>
            <div className="answer">You may upload selfies of yourself next to a stationary vehicle clearly displaying a partner's advertisement. For moving vehicles, you can upload a video or photo showing the advertisement. Uploads must be original, unedited, and match your profile picture.</div>
          </div>
          <div className="faq-item">
            <div className="question">Can I upload the same image more than once?</div>
            <div className="answer">Yes, uploading the same image across different social media platforms counts as separate submissions. However, uploading the same image repeatedly to a single platform will lead to account cancellation and forfeiture of entries.</div>
          </div>
          <div className="statement">
            However, uploading the same image repeatedly to a single platform will lead to account cancellation and forfeiture of entries.
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Bonus Entries and Milestones</div>
          <div className="faq-item">
            <div className="question">How do bonus entries work?</div>
            <div className="answer">You receive bonus entries at key upload milestones:</div>
            <div className="answer">32 uploads = 5 bonus entries</div>
            <div className="answer">48 uploads = 10 bonus entries</div>
            <div className="answer">96 uploads = 20 bonus entries</div>
          </div>
          <div className="statement">Are there other ways to boost my entries?</div>
          <div className="statement">If you scan an advertiser from every industry in your area, all your prize draw entries are doubled, rapidly elevating your leaderboard position. You can see the available number of advertisers on your "MY POSITION" Page (HYPERLINK)</div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Leaderboard and Prize Categories</div>
          <div className="faq-item">
            <div className="question">How does the leaderboard work?</div>
            <div className="answer">The leaderboard tracks your progress and divides participants into five prize categories, based on position:</div>
            <div className="answer">Top 100: Ultimate prize (luxury vehicle)</div>
            <div className="answer">101—250: Category 2 prizes</div>
            <div className="answer">251—500: Category 3 prizes</div>
            <div className="answer">501—750: Category 4 prizes</div>
            <div className="answer">751 and above: Category 5 prizes</div>
          </div>
          <div className="faq-item">
            <div className="question">What if I am unsuccessful in a higher category draw, do I still qualify for lower category?</div>
            <div className="answer">Yes, you are automatically entered into all category draws below your qualifying category, so for example if you are a category 1 qualifier you will be entered also into the draw into categories 2-5 subject to not having won a prize in any higher category. This gives the leading competitors up to 9 chances of winning a valuable prize.</div>
          </div>
          <div className="statement">You can check your live stats and advertiser scan progress on the "MY POSITION" (HYPERLINK) page via the top menu.</div>
          <div className="statement">What happens if two participants have the same number of entries?</div>
          <div className="statement">In the event of a tie, preference is given to the participant who has tagged the most contacts.</div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Upload Monitoring and Verification</div>
          <div className="faq-item">
            <div className="question">How can I track my progress?</div>
            <div className="answer">Use the calculator in the menu or your "My Position" dashboard to monitor your uploads and milestones.</div>
          </div>
          <div className="faq-item">
            <div className="question">How are uploads verified?</div>
            <div className="answer">If you win a prize, all uploads are carefully reviewed to ensure:</div>
            <div className="answer">Images are original and unedited</div>
            <div className="answer">They match your profile picture</div>
            <div className="answer">Backgrounds are unique to prevent duplication</div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Fairness and Safety</div>
          <div className="faq-item">
            <div className="question">What are the rules for fair competition?</div>
            <div className="answer">Only authentic images that have not been altered or excessively reused are accepted. Posting too many duplicates to a single platform may disqualify you.</div>
          </div>
          <div className="faq-item">
            <div className="question">Is participant safety important?</div>
            <div className="answer">Absolutely. Never jeopardize your safety to obtain an image. Do not chase moving vehicles or put yourself at risk.</div>
            <div className="answer">Your safety is your own responsibility, and Rule 7 Media and/or "Gotta Scan Them All"' accepts no liability for injury or loss of life.</div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Messages and Marketing Opportunities</div>
          <div className="faq-item">
            <div className="question">Will I receive notifications from other users or partners?</div>
            <div className="answer">Yes. You may receive messages from other participants and marketing partners. Keep an eye out for additional marketing opportunities in your area, as these may provide extra chances to enter and win.</div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">Privacy and Security</div>
          <div className="faq-item">
            <div className="question">How is my privacy protected?</div>
            <div className="answer">User privacy is taken seriously. A double opt-in process is used: upon registration, you'll receive an email with a unique link. Click this link to confirm your account and secure your eligibility for prize draws and offers.</div>
          </div>
          <div className="statement">If you have more questions, please refer to the "My Position page or contact support through the platform.</div>
        </section>
      </div>
    </div>
  )
}

export default FAQPage
