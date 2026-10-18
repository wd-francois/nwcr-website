/**
 * CSS for the exact (PDF-identical) layout of a capability statement page.
 *
 * The same rules are needed in several places — always for the cover, inside a
 * container query for each width threshold, and in print — so they are generated
 * from one template instead of being copied by hand.
 *
 * Units: every coordinate is a % of the page width, applied with `cqw`
 * (1cqw = 1% of the page's container width), so the layout scales exactly.
 * 0.8585 = Montserrat ascent (0.968) minus half the extra leading at line-height 1
 * — it converts the PDF baseline into the CSS top edge of the line box.
 */
const rules = (frame: string) => {
  // Doubling the frame class keeps these rules stronger than the reflow styles.
  const p = `${frame}.cs-frame`;
  return `
${p} .cs-canvas{position:relative;aspect-ratio:var(--ar);padding:0;border-radius:0;background:none}
${p} .cs-bg{display:block;position:absolute;inset:0}
${p} .cs-bg img{width:100%;height:100%}
${p} .cs-content{position:absolute;inset:0;padding:0;text-align:left;color:#231f20}
${p} .cs-content :is(h1,h2,h3,h4,p,ul,li){margin:0;padding:0;list-style:none;font-size:1rem;background:none;border-radius:0;box-shadow:none;display:block}
${p} .cs-line{position:absolute;display:block;left:calc(var(--x) * 1cqw);top:calc((var(--y) - 0.8585 * var(--fs)) * 1cqw);font-size:calc(var(--fs) * 1cqw);line-height:1;white-space:nowrap;color:var(--c);letter-spacing:calc(var(--ls, 0) * 1em);text-transform:none}
${p} .cs-line[data-center]{left:calc(var(--cx) * 1cqw);transform:translateX(-50%)}
${p} .cs-line a{color:inherit;text-decoration:none}
${p} .cs-line a:hover{text-decoration:underline}
${p} .cs-shadow{text-shadow:0 0.15cqw 0.9cqw rgb(0 0 0 / 0.7)}
${p} .cs-iso li{position:absolute;display:flex;flex-direction:column;left:calc(var(--x) * 1cqw);top:calc((var(--y) - 0.8 * var(--fs)) * 1cqw);font-size:calc(var(--fs) * 1cqw);line-height:1.2;white-space:nowrap;font-family:'Helvetica Neue',Arial,sans-serif;font-stretch:condensed;font-weight:400;color:#231f20;padding:0;background:none;box-shadow:none}
${p} .cs-flow-only,${p} .cs-content .cs-flow-only{display:none}
`;
};

export const replicaCss = [
  rules('.cs-bp-0'),
  `@container cs (min-width: 660px) {${rules('.cs-bp-660')}}`,
  `@container cs (min-width: 1100px) {${rules('.cs-bp-1100')}}`,
  `@container cs (min-width: 1320px) {${rules('.cs-bp-1320')}}`,
  `@media print {${rules('.cs-frame')}}`,
]
  .join('\n')
  .replace(/\s*\n\s*/g, '\n');
