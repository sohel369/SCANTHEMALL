import React from "react"
import './ContactPage.css'

const topOfficeLocations = [
  {
    country: 'United States',
    address: '307 W 38th st,\nNew York,\nNY 10018,\nUSA',
    email: 'usa@rule7media.com'
  },
  {
    country: 'Australia',
    address: '4 Marina Promenade,\nParadise Point,\nQueensland, 421 6\nAustralia',
    email: 'australia@rule7media.com'
  },
  {
    country: 'Canada',
    address: '5307 Victoria Drive,\nVancouver,\nBC, V5P 3V6,\nCanada',
    email: 'canada@rule7media.com'
  },
  {
    country: 'Japan',
    address: '7F Fuji Building 40,\n15-14 Sakuragaokacho\nShibuya-ku,\nTokyo, 150-0031,\nJapan',
    email: 'japan@rule7media.com'
  },
  {
    country: 'China',
    address: 'Changanqu\nWanke Mianhua, 15-1912,\n710119, Xi\'an (Shaanxi),\nChina',
    email: 'china@rule7media.com'
  },
  {
    country: 'India',
    address: '218, 2nd Floor,\nUnitech Arcadia Building,\n122018 Gurgaon (HR),\nIndia',
    email: 'india@rule7media.com'
  }
]

const bottomOfficeLocations = [
  {
    offices: [
      {
        country: 'Thailand',
        address: 'No.8 Narathiwas\nRajanagarindra Road,\n10120 Bangkok (Bangkok),\nThailand',
        email: 'thailand@rule7media.com'
      },
      {
        country: 'Spain',
        address: 'Calle Purisima 5,\n46540 El Puig, V\nSpain',
        email: 'spain@rule7media.com'
      },
      {
        country: 'Indonesia',
        address: 'Menara Cakrawala,\n9th floor, North Wing,\nUnit 904,\n10340 Central Jakarta (JK),\nIndonesia',
        email: 'Indonesia@rule7media.com'
      }]
  },
  {
    offices: [
      {
        country: 'France',
        address: 'Société AirSelli,\n2 Rue Alexandre Ribot,\nNogent-sur-Oise 60180,\nFrance',
        email: 'france@rule7media.com'
      },
      {
        country: 'United Kingdom',
        address: '128 City Road,\nLondon,\nECl V 2 NX',
        email: 'uk@rule7media.com'
      }
    ]
  }
]

const ContactPage = () => {
  return (
    <main className="contact-page">
      <div className="contact-banner">
        <svg className="svg1" viewBox="0 0 359 78" fill="none">
          <path d="M29.39 0L0 77.22H358.5L329.38 46.57" fill="#D4A017" />
        </svg>
        <svg className="svg2" viewBox="0 0 378 80" fill="none">
          <path d="M377.79 57.14L13.64 79.11L0 0H354.52L377.79 57.14Z" fill="#D91A2A" />
        </svg>
        <div>Contact us</div>
      </div>

      <div className="top-offices-container">
        <svg className="svg1" viewBox="0 0 1159 48" fill="none">
          <path d="M1158.39 0L236.81 9.95001L0 47.97L1158.39 0Z" fill="#D91A2A" />
        </svg>
        <svg className="svg2" viewBox="0 0 211 478" fill="none">
          <path d="M0 2.03L210.05 477.87L128.57 0L0 2.03Z" fill="#D91A2A" />
        </svg>
        <svg className="svg3" viewBox="0 0 1212 618" fill="none">
          <path d="M1211.36 558.68L88.95 516.06L0 617.22L0.389999 44.15L1051.45 0L1211.36 558.68Z" fill="#1C2526" />
        </svg>
        <svg className="svg4" viewBox="0 0 1093 55" fill="none">
          <path d="M0 0L727.56 54.57L1092.41 29.86L0 0Z" fill="#D4A017" />
        </svg>
        <div className="office-grid">
          {topOfficeLocations.map((office) => (
            <div className="office-location" key={office.country + office.address}>
              <div className="office-country">{office.country}</div>
              <div className="office-address">
                {
                  office.address.split('\n').map((line) => (
                    <React.Fragment key={line}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                }
              </div>
              <a href={`mailto:${office.email}`} className="office-email">{office.email}</a>
            </div>
          ))}
          <svg className="svg1" viewBox="0 0 2 154" fill="none">
            <g clipPath="url(#clip0_1_9989)">
              <g opacity="0.59">
                <path d="M0.699219 0C1.69922 50.92 1.69922 102.42 0.699219 153.34C-0.300781 102.42 -0.300781 50.92 0.699219 0Z" fill="#E0E0E0" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_1_9989">
                <rect width="1.45" height="153.34" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <svg className="svg2" viewBox="0 0 2 154" fill="none">
            <g opacity="0.59">
              <path d="M0.75 0C1.75 50.92 1.75 102.42 0.75 153.34C-0.25 102.42 -0.25 50.92 0.75 0Z" fill="#E0E0E0" />
            </g>
          </svg>
          <svg className="svg3" viewBox="0 0 2 154" fill="none">
            <g opacity="0.59">
              <path d="M0.75 0C1.75 50.92 1.75 102.42 0.75 153.34C-0.25 102.42 -0.25 50.92 0.75 0Z" fill="#E0E0E0" />
            </g>
          </svg>
          <svg className="svg4" viewBox="0 0 2 154" fill="none">
            <g opacity="0.59">
              <path d="M0.75 0C1.75 50.92 1.75 102.42 0.75 153.34C-0.25 102.42 -0.25 50.92 0.75 0Z" fill="#E0E0E0" />
            </g>
          </svg>
        </div>
      </div>
      <div className="bottom-offices-container">
        <svg className="svg1" viewBox="0 0 1092 65" fill="none">
          <path d="M1091.86 64.98L365.16 0L0 19.49L1091.86 64.98Z" fill="#D91A2A" />
        </svg>
        <svg className="svg2" viewBox="0 0 211 478" fill="none">
          <path d="M210.05 475.84L0 0L81.48 477.87L210.05 475.84Z" fill="#D91A2A" />
        </svg>
        <svg className="svg3" viewBox="0 0 1212 618" fill="none">
          <path d="M0 58.54L1122.4 101.16L1211.35 0L1210.96 573.07L159.9 617.22L0 58.54Z" fill="#1C2526" />
        </svg>
        <svg className="svg4" viewBox="0 0 1159 48" fill="none">
          <path d="M0 47.9701L921.59 38.02L1158.39 0L0 47.9701Z" fill="#D4A017" />
        </svg>
        <div className="office-grid">
          {bottomOfficeLocations[0].offices.map((office) => (
            <div className="office-location" key={office.country + office.address}>
              <div className="office-country">{office.country}</div>
              <div className="office-address">
                {
                  office.address.split('\n').map((line) => (
                    <React.Fragment key={line}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                }
              </div>
              <a href={`mailto:${office.email}`} className="office-email">{office.email}</a>
            </div>
          ))}
          <svg className="svg1" viewBox="0 0 2 154" fill="none">
            <g clipPath="url(#clip0_1_9972)">
              <g opacity="0.59">
                <path d="M0.700195 0C1.7002 50.92 1.7002 102.42 0.700195 153.34C-0.299805 102.42 -0.299805 50.92 0.700195 0Z" fill="#E0E0E0" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_1_9972">
                <rect width="1.45" height="153.34" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <svg className="svg2" viewBox="0 0 2 154" fill="none">
            <g clipPath="url(#clip0_1_9975)">
              <g opacity="0.59">
                <path d="M0.700195 0C1.7002 50.92 1.7002 102.42 0.700195 153.34C-0.299805 102.42 -0.299805 50.92 0.700195 0Z" fill="#E0E0E0" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_1_9975">
                <rect width="1.45" height="153.34" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="office-grid last-offices-line">
          {bottomOfficeLocations[1].offices.map((office) => (
            <div className="office-location" key={office.country + office.address}>
              <div className="office-country">{office.country}</div>
              <div className="office-address">
                {
                  office.address.split('\n').map((line) => (
                    <React.Fragment key={line}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))
                }
              </div>
              <a href={`mailto:${office.email}`} className="office-email">{office.email}</a>
            </div>
          ))}
          <svg className="svg3" viewBox="0 0 2 154" fill="none">
            <g clipPath="url(#clip0_1_9978)">
              <g opacity="0.59">
                <path d="M0.700195 0C1.7002 50.92 1.7002 102.42 0.700195 153.34C-0.299805 102.42 -0.299805 50.92 0.700195 0Z" fill="#E0E0E0" />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_1_9978">
                <rect width="1.45" height="153.34" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </main>
  )
}

export default ContactPage
