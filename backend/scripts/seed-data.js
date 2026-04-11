import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'imageupload',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
});

const platforms = [
    { name: 'facebook', display_name: 'Facebook' },
    { name: 'instagram', display_name: 'Instagram' },
    { name: 'youtube', display_name: 'YouTube' },
    { name: 'wechat', display_name: 'WeChat' },
    { name: 'twitter', display_name: 'Twitter/X' },
    { name: 'linkedin', display_name: 'LinkedIn' },
    { name: 'tiktok', display_name: 'TikTok' },
    { name: 'pinterest', display_name: 'Pinterest' },
    { name: 'snapchat', display_name: 'Snapchat' },
    { name: 'reddit', display_name: 'Reddit' },
    { name: 'whatsapp', display_name: 'WhatsApp' },
    { name: 'telegram', display_name: 'Telegram' },
    { name: 'tumblr', display_name: 'Tumblr' },
    { name: 'discord', display_name: 'Discord' }
];

const placementTypes = [
    { type: 'medium_rectangle', name: 'medium_rectangle_1', width: 300, height: 250, price: 500, desc: 'Medium Rectangle - Top Position' },
    { type: 'medium_rectangle', name: 'medium_rectangle_2', width: 300, height: 250, price: 450, desc: 'Medium Rectangle - Middle Position' },
    { type: 'medium_rectangle', name: 'medium_rectangle_3', width: 300, height: 250, price: 400, desc: 'Medium Rectangle - Sidebar Position' },
    { type: 'medium_rectangle', name: 'medium_rectangle_4', width: 300, height: 250, price: 400, desc: 'Medium Rectangle - Bottom Position' },
    { type: 'leaderboard', name: 'leaderboard_top', width: 728, height: 90, price: 800, desc: 'Leaderboard - Top Banner' },
    { type: 'leaderboard', name: 'leaderboard_bottom', width: 728, height: 90, price: 700, desc: 'Leaderboard - Bottom Banner' },
    { type: 'skyscraper', name: 'skyscraper_left', width: 160, height: 600, price: 600, desc: 'Skyscraper - Left Sidebar' },
    { type: 'skyscraper', name: 'skyscraper_right', width: 160, height: 600, price: 600, desc: 'Skyscraper - Right Sidebar' }
];

const regionalPricing = [
    { region: 'Los Angeles Metro', country: 'US', state: 'CA', multiplier: 1.80, desc: 'Greater Los Angeles area including Orange County' },
    { region: 'New York Metro', country: 'US', state: 'NY', multiplier: 2.00, desc: 'New York City and surrounding areas' },
    { region: 'San Francisco Bay Area', country: 'US', state: 'CA', multiplier: 1.90, desc: 'San Francisco, Oakland, San Jose metro area' },
    { region: 'Chicago Metro', country: 'US', state: 'IL', multiplier: 1.50, desc: 'Chicago and surrounding suburbs' },
    { region: 'Miami Metro', country: 'US', state: 'FL', multiplier: 1.40, desc: 'Miami-Fort Lauderdale-West Palm Beach' },
    { region: 'Dallas-Fort Worth', country: 'US', state: 'TX', multiplier: 1.30, desc: 'Dallas-Fort Worth metroplex' },
    { region: 'Houston Metro', country: 'US', state: 'TX', multiplier: 1.30, desc: 'Greater Houston area' },
    { region: 'San Diego Metro', country: 'US', state: 'CA', multiplier: 1.40, desc: 'San Diego County' },
    { region: 'Austin Metro', country: 'US', state: 'TX', multiplier: 1.25, desc: 'Austin and surrounding areas' },
    { region: 'Seattle Metro', country: 'US', state: 'WA', multiplier: 1.35, desc: 'Seattle-Tacoma-Bellevue' },
    { region: 'Denver Metro', country: 'US', state: 'CO', multiplier: 1.20, desc: 'Denver and surrounding areas' },
    { region: 'Phoenix Metro', country: 'US', state: 'AZ', multiplier: 1.15, desc: 'Greater Phoenix area' },
    { region: 'Sydney Metro', country: 'AU', state: 'NSW', multiplier: 1.60, desc: 'Greater Sydney area' },
    { region: 'Melbourne Metro', country: 'AU', state: 'VIC', multiplier: 1.50, desc: 'Greater Melbourne area' },
    { region: 'Brisbane Metro', country: 'AU', state: 'QLD', multiplier: 1.30, desc: 'Greater Brisbane area' },
    { region: 'Perth Metro', country: 'AU', state: 'WA', multiplier: 1.20, desc: 'Greater Perth area' },
    { region: 'London Metro', country: 'GB', state: 'ENG', multiplier: 1.90, desc: 'Greater London area' },
    { region: 'Manchester Metro', country: 'GB', state: 'ENG', multiplier: 1.40, desc: 'Greater Manchester area' },
    { region: 'Birmingham Metro', country: 'GB', state: 'ENG', multiplier: 1.30, desc: 'Birmingham and West Midlands' },
    { region: 'Toronto Metro', country: 'CA', state: 'ON', multiplier: 1.50, desc: 'Greater Toronto Area' },
    { region: 'Vancouver Metro', country: 'CA', state: 'BC', multiplier: 1.45, desc: 'Greater Vancouver area' },
    { region: 'Montreal Metro', country: 'CA', state: 'QC', multiplier: 1.35, desc: 'Greater Montreal area' },
    { region: 'Other US Markets', country: 'US', state: '', multiplier: 1.00, desc: 'All other US markets' },
    { region: 'Other AU Markets', country: 'AU', state: '', multiplier: 1.00, desc: 'All other Australian markets' },
    { region: 'Other UK Markets', country: 'GB', state: '', multiplier: 1.00, desc: 'All other UK markets' },
    { region: 'Other CA Markets', country: 'CA', state: '', multiplier: 1.00, desc: 'All other Canadian markets' }
];

async function seedAdPlacements(pool) {
    try {
        // Check if data already exists
        const checkResult = await pool.query('SELECT COUNT(*) FROM platforms');
        const count = parseInt(checkResult.rows[0].count);

        if (count > 0) {
            console.log('   ⚠️  Ad placements data already exists, skipping seeding');
            return;
        }

        console.log('   📱 Seeding platforms...');
        const platformIds = {};

        for (const platform of platforms) {
            const result = await pool.query(
                'INSERT INTO platforms (name, display_name) VALUES ($1, $2) ON CONFLICT (name) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING id',
                [platform.name, platform.display_name]
            );
            platformIds[platform.name] = result.rows[0].id;
        }

        console.log(`   ✅ Seeded ${platforms.length} platforms`);

        console.log('   🎯 Seeding placements...');
        let totalPlacements = 0;

        for (const [platformName, platformId] of Object.entries(platformIds)) {
            for (const placement of placementTypes) {
                await pool.query(
                    `INSERT INTO placements (platform_id, placement_type, position_name, width, height, base_price, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (platform_id, position_name) DO UPDATE SET
             width = EXCLUDED.width,
             height = EXCLUDED.height,
             base_price = EXCLUDED.base_price,
             description = EXCLUDED.description`,
                    [platformId, placement.type, placement.name, placement.width, placement.height, placement.price, placement.desc]
                );
                totalPlacements++;
            }
        }

        console.log(`   ✅ Seeded ${totalPlacements} placements (${placementTypes.length} per platform)`);

        console.log('   💰 Seeding regional pricing...');

        for (const pricing of regionalPricing) {
            // Use empty string for null state values
            const stateValue = pricing.state || '';

            // Check if entry exists
            const checkQuery = `
        SELECT id FROM regional_pricing 
        WHERE region_name = $1 AND country = $2 AND state = $3
      `;
            const existing = await pool.query(checkQuery, [pricing.region, pricing.country, stateValue]);

            if (existing.rows.length > 0) {
                // Update existing
                await pool.query(
                    `UPDATE regional_pricing 
           SET price_multiplier = $1, description = $2
           WHERE id = $3`,
                    [pricing.multiplier, pricing.desc, existing.rows[0].id]
                );
            } else {
                // Insert new
                await pool.query(
                    `INSERT INTO regional_pricing (region_name, country, state, price_multiplier, description)
           VALUES ($1, $2, $3, $4, $5)`,
                    [pricing.region, pricing.country, stateValue, pricing.multiplier, pricing.desc]
                );
            }
        }

        console.log(`   ✅ Seeded ${regionalPricing.length} regional pricing entries`);
        console.log('\n🎉 Ad placements seeding completed successfully!');

    } catch (error) {
        console.error('   ❌ Error seeding ad placements:', error.message);
        throw error;
    }
}

async function seedBonusMilestones(pool) {
    try {
        // Check if data already exists
        const checkResult = await pool.query('SELECT COUNT(*) FROM bonus_entry_milestones');
        const count = parseInt(checkResult.rows[0].count);

        if (count > 0) {
            console.log('   ⚠️  Bonus milestones already exist, skipping seeding');
            return;
        }

        const milestones = [
            { uploads: 10, bonus: 5, desc: 'First milestone! Welcome to the club!' },
            { uploads: 50, bonus: 15, desc: 'Halfway to 100! Keep it up!' },
            { uploads: 100, bonus: 30, desc: 'Century club! You\'re on fire!' },
            { uploads: 250, bonus: 75, desc: 'Quarter thousand! Amazing dedication!' },
            { uploads: 500, bonus: 200, desc: 'Elite status! You\'re a legend!' },
            { uploads: 1000, bonus: 500, desc: 'Legendary! Ultimate achievement!' }
        ];

        for (const milestone of milestones) {
            await pool.query(
                'INSERT INTO bonus_entry_milestones (upload_count, bonus_entries, description) VALUES ($1, $2, $3) ON CONFLICT (upload_count) DO NOTHING',
                [milestone.uploads, milestone.bonus, milestone.desc]
            );
        }

        console.log(`   ✅ Seeded ${milestones.length} bonus entry milestones`);

    } catch (error) {
        console.error('   ❌ Error seeding bonus milestones:', error.message);
        throw error;
    }
}

async function seedData() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting database seeding...\n');

        // Seed ad placements data
        console.log('\n🌱 Seeding ad placements data...');
        await seedAdPlacements(pool);

        // Seed bonus milestones
        console.log('\n🎯 Seeding bonus entry milestones...');
        await seedBonusMilestones(pool);

        // Seed Sample Draws
        console.log('🎯 Seeding sample draws...');
        await client.query(`
      INSERT INTO draws (name, country, city, wave, next_number, status, start_date, end_date, description) VALUES
        ('New York Dream Car Draw', 'USA', 'NYC', 'W1', 0, 'upcoming', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '90 days', 'Win your dream car in New York City!'),
        ('Los Angeles Luxury Draw', 'USA', 'LA', 'W1', 0, 'upcoming', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '90 days', 'Luxury vehicles up for grabs in LA!'),
        ('London Premium Draw', 'UK', 'LON', 'W1', 0, 'upcoming', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '90 days', 'Premium cars in London!'),
        ('Toronto Elite Draw', 'CAN', 'TOR', 'W1', 0, 'upcoming', CURRENT_DATE + INTERVAL '30 days', CURRENT_DATE + INTERVAL '90 days', 'Elite vehicles in Toronto!')
      ON CONFLICT DO NOTHING
    `);
        console.log('✅ Sample draws seeded\n');

        // Seed Static Pages
        console.log('📄 Seeding static pages...');
        await client.query(`
      INSERT INTO static_pages (slug, title, content) VALUES
        ('terms', 'Terms and Conditions', $$
          <div>Effective on April 30th, 2025</div>

        <section>
          <div class="section-subtitle">Mission Statement</div>
          <div class="section-content">
            <div>Empowering Advertisers, Vehicle Owners, and Consumers Through Innovative Mobile Advertising</div>
            <div>
              Our mission is to redefine outdoor advertising by seamlessly connecting brands, vehicle owners, and communities in a mutually rewarding ecosystem. We transform everyday vehicles into eye-catching, mobile advertising platforms that drive real-world impact for all stakeholders.
              <br />For advertisers, we provide unparalleled brand visibility and engagement by delivering high-impact, mobile campaigns that reach audiences where they live, work, and play. Our innovative vinyl wrap solutions ensure messages are seen by millions, fostering brand recognition and measurable results—mile after mile.
              <br />For vehicle owners, we open new avenues for participation and profit, enabling them to turn their vehicles into valuable advertising assets. Through our campaigns, owners become active ambassadors, benefiting from incentives and rewards while supporting brands they believe in.
              <br />For consumers, we create interactive and engaging experiences that go beyond passive advertising. Our platform invites individuals to scan, share, and connect with campaigns—earning rewards and discovering new brands in ways that are fun, accessible, and community-driven.
              <br />Driven by creativity, technology, and collaboration, we strive to make advertising more dynamic, inclusive, and effective, forging lasting connections and shared success for advertisers, vehicle owners, and consumers alike.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">Table of Contents:</div>
          <div class="section-content">
            <div>
              Introduction
              <br />Obligations
              <br />Rights and Limits
              <br />Disclaimer and Limit of Liability
              <br />Termination
              <br />Governing Law and Dispute Resolution
              <br />General Terms
              <br />Rule 7 Media "Do's and Don'ts"
              <br />Complaints Regarding Content
              <br />How To Contact Us
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">1.1 Contract</div>
          <div class="section-content">
            <div>
              When you use our Services you agree to all of these terms. Your use of our Services is also subject to our Cookie Policy and our Privacy Policy, which covers how we collect, use, share, and store your personal information.
              <br />By creating a Rule 7 Media account or accessing or using our Services (described below), you are agreeing to enter into a legally binding contract with Rule 7 Media (even if you are using third party credentials or using our Services on behalf of a company). If you do not agree to this contract ("Contract" or "User Agreement"), do not create an account or access or otherwise use any of our Services. If you wish to terminate this Contract at any time, you can do so by closing your account and no longer accessing or using our Services.
            </div>
            <div>
              Services
              <br />This Contract applies to Rule 7 Media .com, Rule 7 Media -branded apps, and other Rule 7 Media -related sites, apps, communications, and other services that state that they are offered under this Contract ("Services"), including the offsite collection of data for those Services, such as via our ads and the "Apply with Rule 7 Media " and "Share with Rule 7 Media " plugins.
            </div>
            <div>
              Rule 7 Media
              <br />You are entering into this Contract with Rule 7 Media (also referred to as "we" and "us").
            </div>
            <div>We use the term "Designated Countries" to refer to countries in the European Union (EU), European Economic Area (EEA), and Switzerland.</div>
            <div>If you reside in the "Designated Countries", you are entering into this Contract with Rule 7 Media Ireland Unlimited Company ("Rule 7 Media Ireland") and Rule 7 Media Ireland will be the controller of your personal data provided to, or collected by or for, or processed in connection with our Services.</div>
            <div>If you reside outside of the "Designated Countries", you are entering into this Contract with Rule 7 Media Corporation ("Rule 7 Media Corp.") and Rule 7 Media Corp. will be the controller of (or business responsible for) your personal data provided to, or collected by or for, or processed in connection with our Services.</div>
            <div>As a Visitor or Member of our Services, the collection, use, and sharing of your personal data is subject to our Privacy Policy, our Cookie Policy and other documents referenced in our Privacy Policy, and updates. You acknowledge and have read our Privacy Policy.</div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">1.2 Members and Visitors</div>
          <div class="section-content">
            <div>
              This Contract applies to Members and Visitors.
              <br />When you register and join the Rule 7 Media Services, you become a "Member". If you have chosen not to register for our Services, you may access certain features as a "Visitor."
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">1.3 Changes</div>
          <div class="section-content">
            <div>
              We may make changes to this Contract.
              <br />We may modify this Contract, our Privacy Policy and our Cookie Policy from time to time. If required by applicable law or we make material changes to this Contract, we will provide you notice through our Services, or by other means, to provide you the opportunity to review the changes before they become effective. We agree that changes cannot be retroactive. If you object to any of these changes, you may close your account. Your continued use of our Services after we publish or send a notice about our changes to these terms means that you are consenting to the updated terms as of their effective date.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">2. Obligations</div>
          <div class="section-subtitle">2.1 Service Eligibility</div>
          <div class="section-content">
            <div>
              Here are some promises that you make to us in this Contract:
              <br />You're eligible to enter into this Contract and you are at least our "Minimum Age."
              <br />The Services are not for use by anyone under the age of 16.
            </div>
            <div>To use the Services, you agree that: (1) you must be the "Minimum Age" (described below) or older; (2) you will only have one Rule 7 Media account, which must be in your real name; and (3) you are not already restricted by Rule 7 Media from using the Services. Creating an account with false information is a violation of our terms, including accounts registered on behalf of others or persons under the age of 16.</div>
            <div>"Minimum Age" means 16 years old. However, if law requires that you must be older in order for Rule 7 Media to lawfully provide the Services to you without parental consent (including using your personal data) then the Minimum Age is such older age. Learn More</div>
          </div>
        </section>

        <section>
          <div class="section-title">2.2 Your Account</div>
          <div class="section-content">
            <div>
              You will keep your password a secret
              <br />You will not share your account with anyone else and will follow our policies and the law.
              <br />Members are account holders. You agree to: (1) protect against wrongful access to your account (e.g., use a strong password and keep it confidential); (2) not share or transfer your account or any part of it (e.g., sell or transfer the personal data of others by transferring your connections); and (3) follow the law, our list of Dos and Don'ts (below), and our Professional Community Policies. Learn More You are responsible for anything that happens through your account unless you close it or report misuse.
            </div>
            <div>
              As between you and others (including your employer), your account belongs to you. However, if the Services were purchased by another party for you to use (e.g., Recruiter seat or Rule 7 Media Learning subscription bought by your employer), the party paying for such Service has the right to control access to and get reports on your use of such paid Service; however, they do not have rights to your personal account.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">2.3 Payment</div>
          <div>
            You'll honour your payment obligations and you are okay with us storing your payment information. You understand that there may be fees and taxes that are added to our prices.
            <br />Refunds are subject to our policy, and we may modify our prices prospectively.
            <br />If you buy any of our paid Services, you agree to pay us the applicable fees and taxes and you agree to the additional terms specific to the paid Services. Failure to pay these fees will result in the termination of your paid Services. Also, you agree that:
          </div>
          <div>
            Your purchase may be subject to foreign exchange fees or differences in prices based on location (e.g., exchange rates).
            <br />We may store and continue billing your payment method (e.g., credit card), even after it has expired, to avoid interruptions in your paid Services and to use it to pay for other Services you may buy. You may update or change your payment method. Learn more
            <br />If you purchase a subscription, your payment method automatically will be charged at the start of each subscription period for the fees and taxes applicable to that period. To avoid future charges, cancel before the renewal date. Learn how to cancel or suspend your paid subscription Services.
            <br />We may modify our prices effective prospectively upon reasonable notice to the extent allowed under the law.
            <br />All of your paid Services are subject to Rule 7 Media 's refund policy.
            <br />We may calculate taxes payable by you based on the billing information that you provide us.
            <br />You can get a copy of your invoice through your Rule 7 Media account settings under "Purchase History".
          </div>
        </section>

        <section>
          <div class="section-subtitle">2.4 Notices and Messages</div>
          <div class="section-content">
            <div>
              You're okay with us providing notices and messages to you through our websites, apps, and contact information. If your contact information is out of date, you may miss out on important notices.
              <br />You agree that we will provide notices and messages to you in the following ways: (1) within the Services or (2) sent to the contact information you provided us (e.g., email, mobile number, physical address). You agree to keep your contact information up to date.
            </div>
            <div>
              Please review your settings to control and limit messages you receive from us.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">2.5 Sharing</div>
          <div class="section-content">
            <div>
              When you share information on our Services, others can see, copy and use that information.
              <br />Our Services allow sharing of information (including content) in many ways, such as through your profile, posts, articles, group posts, links to news articles, job postings, messages, and InMails. Depending on the feature and choices you make, information that you share may be seen by other Members, Visitors, or others (on or off of the Services). Where we have made settings available, we will honor the choices you make about who can see content or other information (e.g., message content to your addressees, sharing content only to Rule 7 Media connections, restricting your profile visibility from search tools, or opting not to notify others of your Rule 7 Media profile update). For job searching activities, we default to not notifying your connections or the public. So, if you apply for a job through our Services or opt to signal that you are interested in a job, our default is to share it only with the job poster.
            </div>
            <div>
              To the extent that laws allow this, we are not obligated to publish any content or other information on our Services and can remove it with or without notice.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">3. Rights and Limits</div>
          <div class="section-subtitle">3.1. Your License to Rule 7 Media</div>
          <div class="section-content">
            <div>
              You own all of your original content that you provide to us, but you also grant us a non-exclusive license to it.
              <br />We'll honor the choices you make about who gets to see your content, including how it can be used for ads.
              <br />As between you and Rule 7 Media , you own your original content that you submit or post to the Services.
            </div>

            <div>
              You grant Rule 7 Media and our affiliates the following non-exclusive license to the content and other information you provide (e.g., share, post, upload, and/or otherwise submit) to our Services:
            </div>
            <div>A worldwide, transferable and sublicensable right to use, copy, modify, distribute, publicly perform and display, host, and process your content and other information without any further consent, notice and/or compensation to you or others. These rights are limited in the following ways:
            </div>
            <div>
              You can end this license for specific content by deleting such content from the Services, or generally by closing your account, except (a) to the extent you (1) shared it with others as part of the Services and they copied, re-shared it or stored it, (2) we had already sublicensed others prior to your content removal or closing of your account, or (3) we are required by law to retain or share it with others, and (b) for the reasonable time it takes to remove from backup and other systems.
              <br />We will not include your content in advertisements for the products and services of third parties to others without your separate consent (including sponsored content). However, without compensation to you or others, ads may be served near your content and other information, and your social actions may be visible and included with ads, as noted in the Privacy Policy. If you use a Service feature, we may mention that with your name or photo to promote that feature within our Services, subject to your settings.
              <br />We will honor the audience choices for shared content (e.g., “Connections only”). For example, if you choose to share your post to "Anyone on or off Rule 7 Media ” (or similar): (a) we may make it available off Rule 7 Media ; (b) we may enable others to publicly share onto third-party services (e.g., a Member embedding your post on a third party service); and/or (c) we may enable search tools to make that public content findable though their services. Learn More While we may edit and make format changes to your content (such as translating or transcribing it, modifying the size, layout or file type, and removing or adding labels or metadata), we will take steps to avoid materially modifying the meaning of your expression in content you share with others.
              <br />Because you own your original content and we only have non-exclusive rights to it, you may choose to make it available to others, including under the terms of a Creative Commons license.
              <br />You and Rule 7 Media agree that if content includes personal data, it is subject to our Privacy Policy.
              <br />You and Rule 7 Media agree that we may access, store, process, and use any information (including content and/or personal data) that you provide in accordance with the terms of the Privacy Policy and your choices (including settings).
            </div>
            <div>
              By submitting suggestions or other feedback regarding our Services to Rule 7 Media , you agree that Rule 7 Media can use and share (but does not have to) such feedback for any purpose without compensation to you.
            </div>
            <div>
              You promise to only provide content and other information that you have the right to share and that your Rule 7 Media profile will be truthful.
              <br />You agree to only provide content and other information that does not violate the law or anyone’s rights (including intellectual property rights). You have choices about how much information to provide on your profile but also agree that the profile information you provide will be truthful. Rule 7 Media may be required by law to remove certain content and other information in certain countries.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">3.2 Service Availability</div>
          <div class="section-content">
            <div>
              We may change or limit the availability of some features, or end any Service.
              <br />We may change, suspend or discontinue any of our Services. We may also limit the availability of features, content and other information so that they are not available to all Visitors or Members (e.g., by country or by subscription access).
            </div>
            <div>
              We don’t promise to store or show (or keep showing) any information (including content) that you’ve shared. Rule 7 Media is not a storage service. You agree that we have no obligation to store, maintain or provide you a copy of any content or other information that you or others provide, except to the extent required by applicable law and as noted in our Privacy Policy.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">3.3 Other Content, Sites and Apps</div>
          <div class="section-content">
            <div>
              Your use of others’ content and information posted on our Services, is at your own risk.
              <br />Others may offer their own products and services through our Services, and we aren’t responsible for those third-party activities.
              <br />Others’ Content: By using the Services, you may encounter content or other information that might be inaccurate, incomplete, delayed, misleading, illegal, offensive, or otherwise harmful. You agree that we are not responsible for content or other information made available through or within the Services by others, including Members. While we apply automated tools to review much of the content and other information presented in the Services, we cannot always prevent misuse of our Services, and you agree that we are not responsible for any such misuse. You also acknowledge the risk that others may share inaccurate or misleading information about you or your organization, and that you or your organization may be mistakenly associated with content about others, for example, when we let connections and followers know you or your organization were mentioned in the news. Members have choices about this feature.
            </div>
            <div>
              Others’ Products and Services: Rule 7 Media may help connect you to other Members (e.g., Members using Services Marketplace or our enterprise recruiting, jobs, sales, or marketing products) who offer you opportunities (on behalf of themselves, their organizations, or others) such as offers to become a candidate for employment or other work or offers to purchase products or services. You acknowledge that Rule 7 Media does not perform these offered services, employ those who perform these services, or provide these offered products.
            </div>
            <div>
              You further acknowledge that Rule 7 Media does not supervise, direct, control, or monitor Members in the making of these offers, or in their providing you with work, delivering products or performing services, and you agree that (1) Rule 7 Media is not responsible for these offers, or performance or procurement of them, (2) Rule 7 Media does not endorse any particular Member’s offers, and (3) Rule 7 Media is not an agent or employment agency on behalf of any Member offering employment or other work, products or services. With respect to employment or other work, Rule 7 Media does not make employment or hiring decisions on behalf of Members offering opportunities and does not have such authority from Members or organizations using our products.
            </div>
            <div>
              For Services Marketplace, (a) you must be at least 18 years of age to procure, offer, or perform services, and (b) you represent and warrant that you have all the required licenses and will provide services consistent with the relevant industry standards and our Professional Community Policies.
            </div>
            <div>
              Others’ Events: Similarly, Rule 7 Media may help you register for and/or attend events organized by Members and connect with other Members who are attendees at such events. You agree that (1) Rule 7 Media is not responsible for the conduct of any of the Members or other attendees at such events, (2) Rule 7 Media does not endorse any particular event listed on our Services, (3) Rule 7 Media does not review and/or vet any of these events or speakers, and (4) you will adhere to the terms and conditions that apply to such events.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">3.4 Limits</div>
          <div class="section-content">
            <div>
              We have the right to limit how you connect and interact on our Services.
              <br />Rule 7 Media reserves the right to limit your use of the Services, including the number of your connections and your ability to contact other Members. Rule 7 Media reserves the right to restrict, suspend, or terminate your account if you breach this Contract or the law or are misusing the Services (e.g., violating any of the Dos and Don’ts or Professional Community Policies).
            </div>
            <div>
              We can also remove any content or other information you shared if we believe it violates our Professional Community Policies or Dos and Don’ts or otherwise violates this Contract. Learn more about how we moderate content.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">3.5 Intellectual Property Rights</div>
          <div class="section-content">
            <div>
              We’re providing you notice about our intellectual property rights.
              <br />Rule 7 Media reserves all of its intellectual property rights in the Services. Trademarks and logos used in connection with the Services are the trademarks of their respective owners. Rule 7 Media , and “Rule 7 Media logos and other Rule 7 Media trademarks, service marks, graphics and logos used for our Services are trademarks or registered trademarks of Rule 7 Media .
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">3.6 Recommendations and Automated Processing</div>
          <div class="section-content">
            <div>
              We use data and other information about you to make and order relevant suggestions and to generate content for you and others.
              <br />Recommendations: We use the data and other information that you provide and that we have about Members and content on the Services to make recommendations for connections, content, ads, and features that may be useful to you. We use that data and other information to recommend and to present information to you in an order that may be more relevant for you. For example, that data and information may be used to recommend jobs to you and you to recruiters and to organize content in your feed in order to optimize your experience and use of the Services. Keeping your profile accurate and up to date helps us to make these recommendations more accurate and relevant. Learn More
            </div>
            <div>
              Generative AI Features: By using the Services, you may interact with features we offer that automate content generation for you. The content that is generated might be inaccurate, incomplete, delayed, misleading or not suitable for your purposes. Please review and edit such content before sharing with others. Like all content you share on our Services, you are responsible for ensuring it complies with our Professional Community Policies, including not sharing misleading information.
            </div>
            <div>
              The Services may include content automatically generated and shared using tools offered by Rule 7 Media or others off Rule 7 Media . Like all content and other information on our Services, regardless of whether it's labeled as created by “AI”, be sure to carefully review before relying on it.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">Key Terms</div>
          <div class="section-title">4. Disclaimer and Limit of Liability</div>
          <div class="section-subtitle">4.1 No Warranty</div>
          <div>
            <div>
              This is our disclaimer of legal liability for the quality, safety, or reliability of our Services.
              <br />RULE 7 MEDIA AND ITS AFFILIATES MAKE NO REPRESENTATION OR WARRANTY ABOUT THE SERVICES, INCLUDING ANY REPRESENTATION THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, AND PROVIDE THE SERVICES (INCLUDING CONTENT AND INFORMATION) ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE FULLEST EXTENT PERMITTED UNDER APPLICABLE LAW, RULE 7 MEDIA AND ITS AFFILIATES DISCLAIM ANY IMPLIED OR STATUTORY WARRANTY, INCLUDING ANY IMPLIED WARRANTY OF TITLE, ACCURACY OF DATA, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
            </div>
          </div>
        </section>
        <section>
          <div class="section-subtitle">4.2 Exclusion of Liability</div>
          <div>
            <div>
              These are the limits of legal liability we may have to you.
              <br />TO THE FULLEST EXTENT PERMITTED BY LAW (AND UNLESS RULE 7 MEDIA HAS ENTERED INTO A SEPARATE WRITTEN AGREEMENT THAT OVERRIDES THIS CONTRACT), RULE 7 MEDIA , INCLUDING ITS AFFILIATES, WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPORTUNITIES, REPUTATION (E.G., OFFENSIVE OR DEFAMATORY STATEMENTS), LOSS OF DATA (E.G., DOWN TIME OR LOSS, USE OF, OR CHANGES TO, YOUR INFORMATION OR CONTENT) OR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL OR PUNITIVE DAMAGES.
            </div>
            <div>RULE 7 MEDIA AND ITS AFFILIATES WILL NOT BE LIABLE TO YOU IN CONNECTION WITH THIS CONTRACT FOR ANY AMOUNT THAT EXCEEDS (A) THE TOTAL FEES PAID OR PAYABLE BY YOU TO RULE 7 MEDIA FOR THE SERVICES DURING THE TERM OF THIS CONTRACT, IF ANY, OR (B) US $1000.</div>
          </div>
        </section>
        <section>
          <div class="section-subtitle">4.3 Basis of the Bargain; Exclusions</div>
          <div class="section-content">
            <div>
              The limitations of liability in this Section 4 are part of the basis of the bargain between you and Rule 7 Media and shall apply to all claims of liability (e.g., warranty, tort, negligence, contract and law) even if Rule 7 Media or its affiliates has been told of the possibility of any such damage, and even if these remedies fail their essential purpose.
            </div>
            <div>
              THESE LIMITATIONS OF LIABILITY ALSO APPLY TO LIABILITY FOR DEATH OR PERSONAL INJURY OR FOR FRAUD, GROSS NEGLIGENCE OR INTENTIONAL MISCONDUCT, OR IN CASES OF NEGLIGENCE, WHERE A MATERIAL OBLIGATION HAS BEEN BREACHED. A MATERIAL OBLIGATION BEING AN OBLIGATION WHICH FORMS A PREREQUISITE TO OUR DELIVERY OF SERVICES AND ON WHICH YOU MAY REASONABLY RELY, BUT ONLY TO THE EXTENT THAT THE DAMAGES WERE DIRECTLY CAUSED BY THE BREACH AND WERE FORESEEABLE UPON CONCLUSION OF THIS CONTRACT AND TO THE EXTENT THAT THEY ARE TYPICAL IN THE CONTEXT OF THIS CONTRACT.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">5. Termination</div>
          <div class="section-content">
            <div>
              We can each end this Contract, but some rights and obligations survive.
              <br />Both you and Rule 7 Media may terminate this Contract at any time with notice to the other. On termination, you lose the right to access or use the Services.
              <br />The following shall survive termination:
            </div>
            <div>
              Our rights to use and disclose your feedback;
              <br />Section 3 (subject to 3.1.1);
              <br />Sections 4, 6, 7, and 8.2 of this Contract; and
              <br />Any amounts owed by either party prior to termination remain owed after termination.
              <br />You can visit our Help Center to learn about how to close your account
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">6. Governing Law and Dispute Resolution</div>
          <div class="section-content">
            <div>
              In the unlikely event we end up in a legal dispute, depending on where you live, you and Rule 7 Media agree to resolve it in California courts using California law, Dublin, Ireland courts using Irish law, or as otherwise provided in this section.
              <br />If you live in the Designated Countries, the laws of Ireland govern all claims related to Rule 7 Media 's provision of the Services, but this shall not deprive you of the mandatory consumer protections under the law of the country to which we direct your Services where you have habitual residence. With respect to jurisdiction, you and Rule 7 Media agree to choose the courts of the country to which we direct your Services where you have habitual residence for all disputes arising out of or relating to this User Agreement, or in the alternative, you may choose the responsible court in Ireland.
            </div>
            <div>
              If you are a business user within the scope of Article 6(12) of the EU Digital Markets Act (“DMA”) and have a dispute arising out of or in connection with Article 6(12) of the DMA, you may also utilize the alternative dispute resolution mechanism available in the Help Center.
            </div>
            <div>
              For others outside of Designated Countries, including those who live outside of the United States: You and Rule 7 Media agree that the laws of the State of California, U.S.A., excluding its conflict of laws rules, shall exclusively govern any dispute relating to this Contract and/or the Services. You and Rule 7 Media both agree that all claims and disputes can be litigated only in the federal or state courts in Santa Clara County, California, USA, and you and Rule 7 Media each agree to personal jurisdiction in those courts.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">7. General Terms</div>
          <div class="section-content">
            <div>
              Here are some important details about the Contract.
              <br />If a court with authority over this Contract finds any part of it unenforceable, you and we agree that the court should modify the terms to make that part enforceable while still achieving its intent. If the court cannot do that, you and we agree to ask the court to remove that unenforceable part and still enforce the rest of this Contract.
            </div>
            <div>
              This Contract (including additional terms that may be provided by us when you engage with a feature of the Services) is the only agreement between us regarding the Services and supersedes all prior agreements for the Services.
            </div>
            <div>
              If we don't act to enforce a breach of this Contract, that does not mean that Rule 7 Media has waived its right to enforce this Contract. You may not assign or transfer this Contract (or your membership or use of Services) to anyone without our consent. However, you agree that Rule 7 Media may assign this Contract to its affiliates or a party that buys it without your consent. There are no third-party beneficiaries to this Contract.
            </div>
            <div>
              You agree that the only way to provide us legal notice is at the addresses provided in Section 10.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">8. Rule 7 Media "Dos and Don'ts"</div>

          <div class="section-subtitle">8.1. Dos</div>
          <div class="section-content">
            <div>
              You agree that you will:
            </div>
            <div>
              Comply with all applicable laws, including, without limitation, privacy laws, intellectual property laws, anti-spam laws, export control laws, laws governing the content shared, and other applicable laws and regulatory requirements;
              <br />Provide accurate contact and identity information to us and keep it updated;
              <br />Use the Services in a professional manner.
            </div>
          </div>
        </section>

        <section>
          <div class="section-subtitle">8.2. Don'ts</div>
          <div class="section-content">
            <div>
              You agree that you will not:
            </div>
            <div>
              Create a false identity on Rule 7 Media , misrepresent your identity, create a Member profile for anyone other than yourself (a real person), or use or attempt to use another's account (such as sharing log-in credentials or copying cookies);
              <br />Develop, support or use software, devices, scripts, robots or any other means or processes (such as crawlers, browser plugins and add-ons or any other technology) to scrape or copy the Services, including profiles and other data from the Services;
              <br />Override any security feature or bypass or circumvent any access controls or use limits of the Services (such as search results, profiles, or videos);
              <br />Copy, use, display or distribute any information (including content) obtained from the Services, whether directly or through third parties (such as search tools or data aggregators or brokers), without the consent of the content owner (such as Rule 7 Media for content it owns);
              <br />Disclose information that you do not have the consent to disclose (such as confidential information of others (including your employer);
              <br />Violate the intellectual property rights of others, including copyrights, patents, trademarks, trade secrets or other proprietary rights. For example, do not copy or distribute (except through the available sharing functionality) the posts or other content of others without their permission, which they may give by posting under a Creative Commons license;
              <br />Violate the intellectual property or other rights of Rule 7 Media , including, without limitation, (i) copying or distributing our learning videos or other materials, (ii) copying or distributing our technology, unless it is released under open source licenses; or (iii) using the word “Rule 7 Media ” or our logos in any business name, email, or URL except as provided in the Brand Guidelines;
              <br />Post (or otherwise share) anything that contains software viruses, worms, or any other harmful code;
              <br />Reverse engineer, decompile, disassemble, decipher or otherwise attempt to derive the source code for the Services or any related technology that is not open source;
              <br />Imply or state that you are affiliated with or endorsed by Rule 7 Media without our express consent (e.g., representing yourself as an accredited Rule 7 Media trainer);
              <br />Rent, lease, loan, trade, sell/re-sell or otherwise monetize the Services or related data or access to the same, without Rule 7 Media 's consent;
              <br />Deep-link to our Services for any purpose other than to promote your profile or a Group on our Services, without Rule 7 Media ’s consent;
              <br />Use bots or other unauthorized automated methods to access the Services, add or download contacts, send or redirect messages, create, comment on, like, share, or re-share posts, or otherwise drive inauthentic engagement;
              <br />Engage in “framing”, “mirroring”, or otherwise simulating the appearance or function of the Services;
              <br />Overlay or otherwise modify the Services or their appearance (such as by inserting elements into the Services or removing, covering, or obscuring an advertisement included on the Services);
              <br />Interfere with the operation of, or place an unreasonable load on, the Services (e.g., spam, denial of service attack, viruses, manipulating algorithms);
              <br />Use our Services to do anything that is unlawful, misleading, discriminatory, or fraudulent; and/or
              <br />Misuse our reporting or appeals process, including by submitting duplicative, fraudulent or unfounded reports, complaints or appeals.
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">9. Consent and Release Terms</div>
          <div class="section-content">
            <div>
              I hereby voluntarily release, forever discharge the organisation, the corporation, its officers, directors, employees, volunteer and agents from any and all claims, demands, or causes of action, which are connected with my participation in the "Gotta Scan them All " or the use of this website in accordance with Applicable Law in the State of Queensland Australia and/or the applicable law in the Country, State or territory of my participation in the "Gotta Scan them All " Promotion.
              <br />I agree to pay for any and all medical expenses incurred and give permission to the doctor or health care professional to provide medical care if necessary.
              <br />By Registering to play in this promotion I confirm that I have fully informed myself of the contents of this Consent and Release terms and reading it before I confirmed my participation. I warrant that I possess all the rights, powers, and privileges necessary to agree to these terms with binding legal effect
            </div>
          </div>
        </section>

        <section>
          <div class="section-title">10. Complaints Regarding Content</div>
          <div class="section-content">
            <div>
              Contact information for complaints about content provided by our Members.
              <br />We ask that you report content and other information that you believe violates your rights (including intellectual property rights)
              <br />or otherwise violates this Contract or the law. To the extent we can under law, we may remove or restrict access to content, features, services, or information, including if we believe that it's reasonably necessary to avoid harm to Rule 7 Media or others, violates the law or is reasonably necessary to prevent misuse of our Services. We reserve the right to take action against serious violations of this Contract, including by implementing account restrictions for significant violations.
            </div>
            <div>
              We respect the intellectual property rights of others. We require that information shared by Members be accurate and not in violation of the intellectual property rights or other rights of third parties. We provide a policy and process for complaints concerning content shared, and/or trademarks used, by our Members.
            </div>
          </div>
        </section>
        $$),
        ('privacy', 'Privacy Policy', $$
          <div>
                    Gotta Scan them All™ Privacy Policy
                    <br />Introduction
                    <br />Gotta Scan them All™ is owned and operated by Rule 7 Media a division of Colt Telecom Pty Ltd
                    <br /> (ACN 107 595 862) established since 2004 (“Rule 7 Media”). Rule 7 Media recognises that your privacy is very important and should be treated with respect. We take steps to protect any personal information received by us that can be used to identify an individual user (“you”, “your”, “User”) in accordance with the Privacy Act 1988 (Cth) (Privacy Act).
                </div>
                <div>
                    We are governed by the Australian Privacy Principles which are contained in the Privacy Act and other applicable privacy legislation. Before you provide us with any personal information, you should carefully read through this policy so that you understand and are comfortable with exactly how we will collect, use, store and disclose any personal information you share with us.
                </div>
                <div>
                    By using our website and/or the services covered by this policy and providing your personal information to us, you agree that we can communicate with you for the purposes set out in this policy, including electronically regarding security, privacy and administrative issues relating to your account information.
                </div>
                <div>
                    Who is Gotta Scan them All™?
                    <br />When we refer to “we” (or “our” or “us”) in this policy, that means Colt Telecom Pty Ltd and all its owned subsidiaries. Our headquarters are in Australia, and our website(s) are accessible to an international audience.
                    <br />We provide a platform for individuals to share advertisements from our partner advertisers and in return receive free prize draw entries for valuable prizes. We also provide promotion and marketing services for businesses that wish to reach our audience.
                </div>
                <div>
                    Open and transparent management of personal information
                    <br />We make our privacy policy available on our website located at https://scanthemall.com /help/privacy/ and we can also provide a hard copy version upon request. If you would like more information, a hard copy of this policy, or to contact us in relation to your rights set out below, please contact us using the following details:
                </div>
                <div>
                    Name: Colt Telecom Pty Ltd (ACN 107595 862)
                    <br />Address: 6 Marina Promenade, Paradise Point, QLD, Australia
                    <br />Phone: 61 449532492
                    <br />Email: info@scanthemall.com
                </div>
                <div>
                    What personal information might we collect from you?
                    <br />Personal Information
                    <br />“Personal information” as used in this policy means information or an opinion about an individual whose identity is apparent or can reasonably be ascertained from the information or opinion.
                </div>
                <div>
                    We may collect personal information on our websites and to perform our services such as:
                </div>
                <div>
                    your name, title and pronouns.
                    <br />your contact details (including your contact numbers and email address);
                    <br />your age or date of birth.
                    <br />your demographics (such as your postcode);
                    <br />location data.
                    <br />your password(s);
                    <br />your interaction(s) with our website and services;
                    <br />the sensitive information of the type referred to below; and
                    <br />other types of personal information provided by you in correspondence with us or that we collect in the course of our relationship with you.
                </div>
                <div>
                    Sensitive Information
                    <br />In addition to the types of personal information set out above, we may, during the course of surveys or competitions administered by us, by our Group, or affiliated third parties, collect sensitive information from you, but only if volunteered by you and with your consent.
                </div>
                <div>
                    You can choose not to actively volunteer this personal information to us, our Group, or the relevant affiliated third parties. However, if you do provide this personal information to us when asked or prompted, including sensitive information, you provide your consent to us collecting, storing, using and disclosing that personal and/or sensitive information as necessary for the purpose of collecting it.
                </div>
                <div>
                    Anonymity and pseudonymity
                    <br />In most circumstances, it is impractical for you to communicate with us anonymously. We need to identify you to assist you effectively. However, in circumstances where it is lawful and practicable to do so, we will provide you with the option of not identifying yourself, or using a pseudonym, when you communicate with us.
                </div>
                <div>
                    Collection of solicited personal information
                    <br />We only collect your personal information by lawful and fair means where reasonably necessary for our functions and activities. We collect personal information which:
                </div>
                <div>
                    you provide to us in the course of registering for an account to use our website and services, engaging with our website and services, or to apply for positions with us;
                    <br />you provide to us in physical or electronic documents or correspondence;
                    <br />you provide to us in the course of updating or changing your details;
                    <br />you provide to us during promotional signups, sweepstakes or contest entries;
                    <br />you provide to us during software downloads;
                    <br />is provided to us by third parties who have disclosed that information to us with your consent or otherwise in accordance with the Privacy Act (and only if it would be unreasonable or impracticable to collect the information directly from you); and
                    <br />you provide to us to disclose with your consent to third party service providers for an activity or service in relation to our websites and services.
                    <br />We may also collect personal information about you from legitimate third party sources, including market researchers such as Nielsen and Roy Morgan, that share data and personal information in circumstances where it is lawful and/or you have given permission for them to do so.
                </div>
                <div>
                    Subject to certain exceptions under the Privacy Act, we only collect sensitive information about you if you consent to the collection of the personal information and the personal information is reasonably necessary for our services. The provision of sensitive information to us on a voluntary basis will be taken to be consent for this purpose.
                </div>
                <div>
                    Collection of unsolicited personal information
                    <br />From time to time, we may receive unsolicited personal information about you. Unsolicited personal information is information we may receive from you which is not in response to a request by us for that information or information that we may receive from you in error.
                </div>
                <div>
                    Where we receive unsolicited personal information about you (either directly from you or from a third party), we will consider, within a reasonable period, whether we could have collected that personal information from you had the personal information been solicited.
                </div>
                <div>
                    Where we determine that we could have collected the unsolicited personal information had it been solicited, we will store, use and disclose that personal information in the manner set out in this policy.
                </div>
                <div>
                    Where we determine that we could not have collected the unsolicited personal information had it been solicited, we will destroy or de-identify that unsolicited personal information as soon as practicable, provided it is lawful and reasonable to do so.
                </div>
                <div>
                    Security and integrity
                    <br />We take reasonable steps and measures to protect your personal information from misuse, interference and loss, and from unauthorised access, modification or disclosure. These reasonable steps and measures include:
                </div>
                <div>
                    the implementation and maintenance of physical, electronic, and managerial procedures, in an effort to assure the security, integrity, and accuracy of all personal information that we collect; and
                    <br />the use of password access, VPNs, firewalls and secure servers.
                    <br />We also take reasonable steps to destroy and permanently de-identify personal information which we hold and which is no longer needed for the purposes described in this policy.
                </div>
                <div>
                    How we collect, use and disclose your personal information
                    <br />Generally, we collect, use and disclose your personal information and otherwise process your personal information for the primary purpose of conducting and supporting our website and the provision of our services to you, including to establish, maintain and enhance our relationship with you. Without limiting the foregoing, there are six main categories in which we may collect, store, use or disclose your personal information, being:
                </div>
                <div>
                    Account creation;
                    <br />Communication;
                    <br />Optimisation;
                    <br />Marketing and advertising;
                    <br />Moderation; and
                    <br />Sharing features.
                    <br />We provide below some specific examples of how we use the personal information we collect. These are in addition to anything that we are required or authorised by law to do or which we communicate to you in a separate privacy collection notice.
                </div>
                <div>
                    Account creation
                </div>
                <div>
                    To provide you with an account to use our websites and services.
                    <br />To provide you with certain other content, products and services.
                    <br />Communication
                </div>
                <div>
                    To contact you should we need to
                    <br />To provide you with customer support and useful information in relation to Scanthemall.com website and services.
                    <br />To share communications such as newsletters, updates, special offers and advertisements, which may be of interest to you, and also to advise you of other Group or third party products, services, offers, surveys, promotional signups, sweepstakes, contests, competitions or events which may be of interest to you.
                    <br />To respond to users’ requests, enquires and complaints.
                    <br />To seek your opinions and feedback about our website and services and to conduct other market analysis and research and development.
                    <br />To connect you to our websites and services (including our online discussion forum), as well as to connect you to products and services of our partners and licensees.
                </div>
                <div>
                    Optimisation
                </div>
                <div>
                    To provide, improve and maintain our websites and services.
                    <br />To develop new products and services.
                    <br />To personalise and display communications, advertisements and other content for you.
                    <br />For our administrative functions and internal business purposes, such as maintaining our business records and system administration.
                </div>
                <div>
                    Marketing and advertising
                    <br />Unless you request otherwise, we may also use your personal information for marketing and advertising purposes to send you news, information about our activities and general promotional material which we believe may be useful or of interest to you.
                </div>
                <div>
                    We target (and measure the performance of) ads to users, visitors to our websites and others both on and off our services directly or through a variety of third party partners, using the following data, whether separately or combined:
                </div>
                <div>
                    Data from advertising technologies on and off our services, including web beacons, pixels, ad tags, cookies, and device identifiers;
                    <br />User-provided information (e.g., profile, contact information, title and industry);
                    <br />Data from your use of our services (e.g., search history, feed, content you read, who you follow or is following you, connections, groups participation, page visits, videos you watch, clicking on an ad, etc.), including information from third party sources;
                    <br />Information from advertising partners and publishers such as Google, Nielsen and Roy Morgan; and
                    <br />We will show you ads called sponsored content which look similar to non-sponsored content, except that they are labelled “ads” or “sponsored.” If you take an action (such as like, comment or share) on these ads, your action is associated with your name and viewable by others, including the advertiser. Subject to your settings, if you take a social action on any of the social media services, that action may be mentioned with related ads.
                </div>
                <div>
                    We do not share your personal data with any third-party advertisers or ad networks for their advertising except for:
                </div>
                <div>
                    hashed or device identifiers (to the extent they are personal data in some countries); and
                    <br />with your separate permission (e.g., lead generation form) or data already visible to any users of the services (e.g. profile).
                    <br />However, if you view or click on an ad on or off our websites or apps, the ad provider will get a signal that someone visited the page that displayed the ad, and they may through the use of mechanisms such as cookies, determine it is you. Advertising partners may be able to associate personal data collected by the advertiser directly from you with our cookies and similar technologies. In such instances, we seek to contractually require such advertising partners to obtain your explicit, opt-in consent before doing so.
                </div>
                <div>
                    We use data and content about users for invitations and communications promoting membership and network growth, engagement and our services.
                </div>
                <div>
                    Moderation
                </div>
                <div>
                    Investigate complaints about, or made by, you;
                    <br />Investigate potential or actual breaches of our Terms of Use and our guidelines
                    <br />Examine the use of any of our products and services to pursue any unlawful or prohibited activity; and
                    <br />Assist third parties, including Government agencies or other similar entities, to investigate such matters as required or permitted by law.
                </div>
                <div>
                    Sharing features
                    <br />We may disclose your personal information to:
                </div>
                <div>
                    other members of our Group;
                    <br />other third parties where you have given your consent (express or implied);
                    <br />our professional advisors, contractors or other service provides whom we may engage from time to time to carry out, advise or assist with the carrying out of our functions and activities; and
                    <br />government agencies or other similar entities as required or permitted by law.
                    <br />We also may disclose your personal information to organisations or persons located overseas. For example:
                </div>
                <div>
                    various administrative functions are undertaken by other members of the Group on our behalf, including our moderation function, which is undertaken by employees and contractors of our group in overseas offices.
                    <br />Indirect overseas disclosure of your personal information to third parties overseas may occur as we use storage providers using cloud-based servers and various third party service providers located in countries including but not limited to Singapore, and the Philippines, amongst others
                    <br />If we disclose personal information to a third party in a country which does not have equivalent privacy laws to Australia (including with respect to access and enforcement), we will take reasonable steps in the circumstances to ensure that the overseas recipient does not breach the Privacy Act in respect of that personal information.
                </div>
                <div>
                    Rule 7 Media will not sell, license or otherwise disclose your personal information to third parties unless such disclosure is for the purposes set out in this policy.
                </div>
                <div>
                    The use and disclosure of your personal information for a secondary purpose
                    <br />We will not use or disclose your personal information for a secondary purpose (i.e., for a purpose other than the purposes identified above) unless:
                </div>
                <div>
                    you consent to the use or disclosure for that purpose or you would reasonably expect us to use it for a secondary purpose which is related to the primary purpose;
                    <br />the use or disclosure is required or authorised by law; or
                    <br />the use or disclosure is otherwise permitted by the Privacy Act (for example, as a necessary part of an investigation of suspected unlawful activity).
                    <br />We may also aggregate data for the purposes of market research and analysis. Where this occurs, your information is de-identified by removing data that can identify you, such as your name and contact details.
                </div>
                <div>
                    Interactive features
                    <br />Any personal information that you submit, display, or publish on a forum, blog, channel, bulletin board, chat room, user commenting feature or other interactive sharing or social feature offered through our websites and services, is considered publicly available and can be read, collected, used, and disclosed by other users of those features and other third parties without restriction, except to the extent limited access features are available.
                </div>
                <div>
                    Your choices
                </div>
                <div>
                    Submitting personal information
                    <br />If you wish to access or participate in certain of our websites and services that require your personal information you will be required to submit that personal information. For example, to register for an account with us, participate in certain contests or promotions, or access and/or use certain Rule 7 Media product features or online services. If you do not submit the relevant personal information, then that may limit our ability to respond to your customer support inquiry in a timely fashion or enable access to the service or competition.
                </div>
                <div>
                    Unsubscribing
                    <br />You can opt out of receiving Rule 7 Media communications at any time by clicking the “unsubscribe” link in communications you receive from us. By opting out of our advertising communication emails received from us, you will be removed from the subscriber list. However, you will also lose your ability to post messages on our forum once you have unsubscribed from our mailing list. Please note that if you unsubscribe from Rule 7 Media communications, we may still send you relevant administrative or security notices from time to time.
                </div>
                <div>
                    Cookies and similar technology
                    <br />To assist us to provide our services to you, we directly collect, or another third party authorised by us and on our behalf collect, information from our website using "IP files". We utilise these IP files to automatically record information certain information when you visit our website, monitor our website's traffic patterns and to serve you more efficiently when you visit (or revisit) our website across your devices. We may also track your activity relating to your interactions with our email communications and links contained in those emails.
                </div>
                <div>
                    When you visit this website, our system will record your IP address (the address which identifies your computer or mobile device on the internet), the date, time and duration of your visit, the site from which you linked to our site, the pages viewed and any information downloaded. This information may be considered anonymous information or personal information under the Privacy Act in certain circumstances. For example, while this information is generally not linked to the identity of users, it may be linked to you:
                </div>
                <div>
                    where our website is accessed via links in an email we send you;
                    <br />where we are able to uniquely identify your device(s);
                    <br />where we are able to identify the User accessing our website or using our services; or
                    <br />in combination with the types of personal information that we may collect from you and which are set out above.
                    <br />You can change your browser’s privacy settings to delete or control cookies or other similar technology as you wish. Please note that updating these settings may prevent you from using various functionality features, products or services of our website.
                </div>
                <div>
                    For more information about cookies and how you can opt out, you can visit http://www.youronlinechoices.com.au.
                </div>
                <div>
                    Third party links services and links
                    <br />We do not control the content or links that may appear on third party websites and are not responsible for the practices employed by third party websites and websites linked to or from our website or in communications from us.
                </div>
                <div>
                    Whenever you choose to click these links, you should be aware that this policy and our other policies no longer applies and that each third party website and services may have their own privacy policy and customer service policies. Those third party policies will govern their collection, storage and use of any of your personal information that you may supply to these third parties.
                </div>
                <div>
                    Opting out of marketing and advertising
                    <br />If you do not wish to have your browsing activity tracked or your information used for the purpose of delivering you targeted marketing and advertisements, you may opt-out of the services currently used by us. Please note, you will still continue to receive non-personalised advertisements. Click on the relevant “Opt Out” links provided below for information on how you may opt out of interest based advertising that any of them deliver:
                </div>
                <div>
                    Google's AdX and Double Click for publishers - https://www.google.com/settings/u/0/ads/authenticated?hl=en
                    <br />Google AdSense - https://support.google.com/adsense/answer/142293?hl=en
                    <br />Rubicon Project - https://www.sizmek.com/privacy-policy/p
                    <br />Criteo - https://www.criteo.com/privacy/disable-criteo-services-on-internet-browsers/
                </div>
                <div>
                    Your rights
                    <br />Accessing your personal information
                    <br />Subject to any exceptions in the Privacy Act, if you have provided us with personal information, you may request access to your personal information by contacting us using the contact details provided above. We may ask you to provide proof of your identity if you request access to, or correction of, your personal information.
                </div>
                <div>
                    In the event that a request for access is made, we will review our records to determine what personal information relating to you we hold and endeavour to respond to your request within a reasonable period after the request is made, but in any event, within 30 days.
                </div>
                <div>
                    Once we have notified you of the nature of the personal information relating to you which we hold, we will give you access to your personal information in the manner requested by you, if it is reasonable and practicable to do so.
                </div>
                <div>
                    We do not levy a charge in respect of the making of a request for access to personal information held by us. However, we may charge you for the reasonable costs incurred by us in providing you with access to the personal information held by us.
                </div>
                <div>
                    The Privacy Act provides instances where a holder of personal information may refuse to provide an individual with access to their personal information. If we refuse to give you access to your personal information, we will give you a written notice that sets out our reasons for the refusal and the mechanisms available to complain about our refusal. Whenever you are entitled to access such information, we will provide such information to you via email without charging you for such access.
                </div>
                <div>
                    Correcting your personal information
                    <br />Rule 7 Media takes reasonable steps to keep your personal information as accurate, complete and up-to-date as possible. We make an effort to ensure this data is of high quality, but this relies on the accuracy and frequency of data provided by you.
                </div>
                <div>
                    You can assist us by notifying us if your circumstances change, such as if your name changes.
                </div>
                <div>
                    If we hold personal information about you and you request that we correct the information, we will take reasonable steps to rectify the situation free of charge if we are satisfied that the information is inaccurate, out-of-date, incomplete, irrelevant or misleading. If we refuse to correct your personal information, we will give you a written notice setting out our reasons for the refusal and the mechanisms available to complain about the refusal.
                </div>
                <div>
                    Deleting your account
                    <br />We retain your personal information and all other account related information accessible on our systems and backup systems for up to six (6) months. If you wish to have your account deleted you may do so using the contact details provided above, however your pseudonym username along with your submitted posts will remain on the website.
                </div>
                <div>
                    Subject to the above and our other legal obligations to retain certain business records, if you delete your account, your personal information may be permanently deleted. The deletion of your data may take up to 30 days from accessible systems and up to 90 days from backup systems.
                </div>
                <div>
                    If you choose to have an account with us in the future, you will have to sign up for a new account as none of the information you previously provided or saved within your account will have been saved.
                </div>
                <div>
                    Complaints, questions or further information
                    <br />If you wish to make a complaint about a breach of your privacy by Rule 7 Media you may contact us using the contact details provided above. All complaints will be investigated by an appropriately qualified representative of Rule7 Media We will endeavour to resolve your complaint as quickly as possible and, in any event, within 30 days. We will notify you of the outcome of the investigation, including how we propose to resolve your complaint and what, if any, corrective measures we will implement.
                </div>
                <div>
                    If you are not satisfied with our handling of your complaint, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC). For more information about doing so, visit https://www.oaic.gov.au/privacy/privacy-complaints/.
                </div>
                <div>
                    Changes and updates to this policy
                    <br />Rule 7 Media regularly reviews this policy and may update the policy from time to time, in our sole discretion. We will notify you of any such changes by providing the current version of this policy on our website.
                </div>
                <div>
                    We encourage you to review this policy periodically to stay informed about our collection, use and disclosure of personal information. Your continued use of our websites and services or any other content, products or services covered by this policy constitutes your agreement to this policy and any updates.
                </div>
        $$)
      ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
    `);
        console.log('✅ Static pages seeded\n');

        console.log('✨ Database seeding completed successfully!\n');
        console.log('\n🎉 Ready for production!\n');

    } catch (err) {
        console.error('❌ Error seeding database:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run seeding
seedData().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
