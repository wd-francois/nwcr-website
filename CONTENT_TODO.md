# Content awaiting client confirmation

Items NWCR needs to confirm before (or soon after) launch. Nothing on the site was invented; where wording was adapted from the capability statement or brief, it is noted here for sign-off.

## Must confirm before launch

- [ ] **Melanie's story — family approval.** The About page ("Melanie's Vision") tells the founder story in plain language, based on the capability statement. The family should approve the wording, and whether and how her name and story are presented. _(`src/pages/about.astro`)_
- [ ] **Photos of Melanie — family approval.** A neutral placeholder is shown (`TODO: confirm with family`). Add a photo only with the family's approval. _(see `IMAGES_TODO.md`)_
- [ ] **Flyer artwork — web-use rights.** The dot-painting artwork is Aboriginal art. Confirm web-use permission and the artist credit with the artist. **The home page hero (the capability statement cover artwork) shows this artwork, and so does the Capability Statement page (`/capability-statement/`, currently turned off)**, so permission is needed before launch. The rest of the site shows a plain gradient strip until the licensed file is added to `src/assets/brand/artwork/`.
- [ ] **Capability Statement page — photos of people.** The three photos of people on page 2 (possibly including Melanie) are shown as placeholders. Confirm with the family which photos may be used (see IMAGES_TODO.md).
- [ ] **Client logos — permission to display.** BHP, Fortescue, Roy Hill, Woodside Energy, Rio Tinto, Chevron, OZ Minerals, Monadelphous and Main Roads WA. Remove any client from `src/data/clients.ts` if permission isn't given. Also get current logo files (the Fortescue logo shown is the older FMG version).
- [ ] **Social media URLs.** None are set, so no social links are shown. Add them to `social` in `src/config/site.ts`.

## Please review

- [ ] **Staff on the Contact page.** Fiona (Director), Stevie (Operations Superintendent), Jordan (Admin) and Suzanne (Admin) were copied from the old WordPress contact page, with their photos and emails; Zoe Garland (Administration & Accounts Manager, 0434 444 169) was added. Confirm everyone is still with NWCR, their titles, and that each person is happy for their name, photo and contact details to be published. Edit `src/data/team.ts`.
- [ ] **Main phone number.** The old contact page lists 0437 055 228; this site uses 0438 039 433 (from the 2026 capability statement). Confirm which is correct in `src/config/site.ts`.

- [ ] **Capability Statement wording.** The web page reproduces the 2026 statement word for word, except for these corrections:
  - ISO 14001 and ISO 45001 are labelled "Environmental" and "Health & Safety" (the flyer says "Quality" for all three).
  - "SAIPAM" → "SAIPEM", "was lead by" → "was led by", "derivable MDR package" → "deliverable MDR package".
  - Australian spelling: "licence", "Endeavour", "Utilising … specialised".
  - The website line shows norwestcontractingandrail.com.au instead of www.nwcr.com.au.

  Other wording is as printed, for example "(nee Lockyer – Hicks)", "receive her Angel Wings", "Pilbara TLO" and "R.O.W". The rest of the site uses plainer wording for Melanie's story, so confirm the family is happy with the statement's wording appearing on the website.

- [ ] **Indigenous Tribute page.** Confirm the facts and wording about the 1968 Torres Strait Islander rail gang, the Port Hedland monument and the 2018 50th-anniversary gathering, and provide licensed historic photos. Consider asking the families or community representatives whether they are comfortable with how the story is told.
- [ ] **JV partners.** The brief lists "Nyamal, Ngarluma, Nyangumarta, Warnman; Kariyarra". These are shown as two partner groups. Confirm the correct partner (business) names and how they should be presented.
- [ ] **Decorative motifs.** Per the brief, the site uses simple white oval trails and plain concentric-circle outlines as low-opacity decoration, with no dots, dot fill or symbols. Because concentric circles are also a motif in Aboriginal art, please confirm NWCR is comfortable with them. They can be removed by deleting the `<ConcentricCircles>` uses.
- [ ] **Careers copy.** The "Why work with NWCR" points are drawn from the company values and the brief. Confirm they are accurate, and add roles to `src/data/roles.ts` when hiring.
- [ ] **Service intros.** The Electrical, Contracting, Vegetation & Pest Management and Labour & Equipment Hire pages have short introductions written from the capability lists. The flyer also mentions an "in-family electrical engineer"; this was left out because the meaning was unclear. Confirm or edit.
- [ ] **Project details.** Scope text was rewritten from the brief only (grammar fixed, no facts added). Confirm the client and location labels, especially "Golden Ponds" (shown as the location) and "Leonora mine site".
- [ ] **Company name.** The site uses "Norwest Contracting & Rail"; the logo reads "Norwest Contracting and Rail". Confirm the preferred written form and the legal entity name (e.g. "Pty Ltd") if it should appear next to the ABN.
- [ ] **Contact form provider.** Choose a provider (Formspree, Web3Forms, etc.) and set `PUBLIC_FORM_ENDPOINT`. Until then, the contact page shows the email address.
