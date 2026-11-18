# A-Affordable Insurance Quote Generator

A standalone, responsive HTML/CSS/JavaScript quote-building website.

## Run locally
1. Extract the ZIP file.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. Fill in the quote. The customer preview updates as you type.
4. Select **Export / Print PDF**, then choose **Save as PDF** in the browser print dialog.

## Publish as a website
Upload `index.html`, `styles.css`, and `app.js` to the root of a GitHub repository and enable GitHub Pages under Settings → Pages. You can also upload the files to your existing web host.

## Included
- Responsive A-Affordable-branded interface
- Dropdown-driven customer and policy quote workflow
- Carrier installment, premium financing, and paid-in-full arrangements
- Editable monthly installment amount
- Optional flat finance-charge estimate for premium-financed policies
- Live quote preview and payment calculations
- Browser-local draft saving
- Print stylesheet for letter-size PDF output

## Financing calculation
For a financed quote, the tool estimates a flat finance charge by applying the entered percentage to the premium balance after the down payment. It divides that balance plus the estimated charge by the selected installment count. The monthly payment field remains editable so an agent can enter the exact amount provided by the finance company. If manually overridden, the displayed finance-charge estimate is derived from the resulting scheduled payments compared with the quoted premium.

This is a quote illustration only. It is **not an APR calculation**, amortization schedule, lender payoff amount, or substitute for the finance company's disclosed terms. Use the finance company's actual payment and charges when available. Agency fee is shown separately and is not included in the scheduled total calculation.

## Data and limitations
- Drafts are saved in the browser's local storage on the device being used. They are not shared between employees or devices.
- This version does not connect to an insurance carrier, issue a policy, or bind coverage.
- Review all quote figures and carrier terms before sharing with a customer.
