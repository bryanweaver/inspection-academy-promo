# The Inspection Academy - Q1 2026 Scholarship Landing Page

A promotional landing page for The Inspection Academy's Q1 2026 Scholarship giveaway.

## Live URL
`https://promo.theinspectionacademy.com`

## Key Dates
- **Launch:** December 17, 2025
- **Applications Close:** January 10, 2026 at 11:59 PM CST
- **Live Drawing:** January 16, 2026 at 6:00 PM CST (Facebook Live)

---

## Setup Instructions

### 1. Add Your Logo

Place your logo file in the `images` folder:
- Name it `logo.png`
- Recommended size: 200px wide, transparent background
- Also add a `favicon.ico` for the browser tab

### 2. Set Up Tally Form

1. Go to [Tally.so](https://tally.so) and create a free account
2. Create a new form with these fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Full Name | Short text | Yes | Min 2 chars |
| Email | Email | Yes | |
| Phone | Phone | Yes | |
| City | Short text | Yes | |
| Zip Code | Short text | Yes | 5 digits |
| Employment Status | Dropdown | Yes | See options below |
| Training Timeline | Dropdown | Yes | See options below |
| Essay | Long text | Yes | 250-500 words |
| Texas Resident 18+ | Checkbox | Yes | |
| Communication Consent | Checkbox | Yes | |
| Rules Agreement | Checkbox | Yes | |

**Employment Status Options:**
- Employed full-time
- Employed part-time
- Self-employed
- Unemployed/between jobs
- Retired
- Other

**Training Timeline Options:**
- Immediately (within 1 month)
- Within 3 months
- Within 6 months
- Just exploring options

3. Configure form settings:
   - Redirect after submission: `https://promo.theinspectionacademy.com/thank-you.html`
   - Email notifications: ON (send to mwarner@theinspectionacademy.com)
   - Respondent emails: ON (confirmation email)
   - Prevent duplicate submissions by email: ON

4. Copy your form ID from the Tally URL (e.g., `https://tally.so/r/YOUR_FORM_ID`)

5. Update `index.html` - find this line and replace `YOUR_FORM_ID`:
   ```html
   data-tally-src="https://tally.so/embed/YOUR_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
   ```

### 3. Add Official Rules PDF

1. Save your Official Rules as a PDF
2. Name it `official-rules.pdf`
3. Place it in the `docs` folder

### 4. Configure DNS

Add a CNAME record in your DNS settings:
- **Type:** CNAME
- **Name:** promo
- **Value:** `your-github-username.github.io`

### 5. Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Source: Deploy from branch `main`
4. Custom domain: `promo.theinspectionacademy.com`
5. Enforce HTTPS: ON

### 6. Set Up Analytics (Optional)

**Google Analytics:**
1. Create a GA4 property
2. Uncomment the GA script in `index.html` and `thank-you.html`
3. Replace `G-XXXXXXXXXX` with your Measurement ID

**Facebook Pixel:**
1. Create a pixel in Facebook Business Manager
2. Uncomment the FB Pixel script in both HTML files
3. Replace `YOUR_PIXEL_ID` with your pixel ID

---

## File Structure

```
inspection-academy-promo/
├── index.html          # Main landing page
├── thank-you.html      # Post-submission page
├── CNAME               # Custom domain config
├── README.md           # This file
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Countdown, animations, etc.
├── images/
│   ├── logo.png        # YOUR LOGO HERE
│   └── favicon.ico     # YOUR FAVICON HERE
└── docs/
    ├── README.md       # Instructions
    └── official-rules.pdf  # YOUR RULES PDF HERE
```

---

## Features

- **Countdown Timer:** Animated countdown to drawing date (Jan 16, 2026)
- **Responsive Design:** Mobile-first, works on all devices
- **Scroll Animations:** Elements animate in as you scroll
- **Confetti Effect:** Celebration animation on thank-you page
- **Tally Integration:** Free form service with all required features
- **Analytics Ready:** Placeholders for GA4 and Facebook Pixel

---

## Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary: #c75b57;      /* Main red */
    --accent: #b59d14;       /* Gold accent */
    /* ... */
}
```

### Countdown Date
Edit in `js/main.js`:
```javascript
const CONFIG = {
    drawingDate: new Date('2026-01-16T18:00:00-06:00'),
    // ...
};
```

---

## Testing Checklist

Before launch:
- [ ] Logo displays correctly
- [ ] Tally form loads and submits
- [ ] Redirect to thank-you page works
- [ ] Countdown shows correct time
- [ ] All links work (rules, privacy policy, social)
- [ ] Mobile layout looks good
- [ ] Confetti plays on thank-you page

---

## Support

Contact: mwarner@theinspectionacademy.com
Phone: (281) 917-7360
