# Six at Seven

A concept build: dinner tables of six founders, Thursdays in Delhi NCR. Matched
by an eight-question quiz, checked by a person, seated at venues we have eaten
in. Nobody pitching.

**[BUSINESS-PLAN.md](BUSINESS-PLAN.md)** has the model, unit economics, risks
and the sequence to validate it.

## Status

Concept / demo. No dinners have run, no payments are collected, the quiz has no
backend attached. The testimonial section is labelled as illustrative on the
page itself rather than dressed up as customer quotes.

## Stack

Static HTML, CSS and vanilla JS. No build step, no dependencies to install.
Three.js is pulled from a CDN for the hero table only.

```
index.html
css/style.css        design tokens + all styling (contrast ratios in the header comment)
js/table3d.js        WebGL round dining table, six covers, drag to spin
js/app.js            nav, scroll reveals, marquee, the eight-question quiz
BUSINESS-PLAN.md
```

## Run it

```bash
npx http-server -p 3411 -c-1 .
# open http://localhost:3411
```

## The 3D table

A round table rendered in Three.js: six chairs, six covers (plate, glass,
cutlery), a lit candle at the centre that flickers, and a warm pendant light
casting real shadows. It idles with a slow spin and you can drag it, with
momentum easing back to idle.

It is gated off and replaced with a CSS seat-ring fallback when any of these are
true: viewport under 768px, `prefers-reduced-motion`, no WebGL context, or
Three.js failed to load. The fallback is in the DOM from the start, so the
section is never empty.

## Quiz

Eight questions plus a details step, with back navigation, blur validation,
inline error messages and a confirmation state. It posts nowhere by default.

To start collecting real leads, set `ENDPOINT` in `js/app.js` to a webhook you
control (n8n, Make, Google Apps Script). It POSTs JSON: `{answers, name, phone,
company}`. Leaving it empty keeps the demo honest — the confirmation screen says
outright that no seat was reserved.

## Verification

`/tmp/six-shots/check.js` drives Playwright at 1440 and 375 and asserts, on
every run: zero `[data-reveal]` elements stuck at opacity 0, no horizontal
overflow, exactly one `h1`, zero console errors, the full quiz flow reaching its
confirmation state, empty-submit showing all three field errors, and no tap
target under 44px on mobile.

Contrast ratios were computed rather than eyeballed; the numbers are recorded in
the comment at the top of `css/style.css`. All pairs clear WCAG AA for body text.

## Before this goes live

- Point the quiz at a real webhook, or take the form down
- Replace the illustrative quotes with real ones after the first dinners
- Add CSP, `X-Frame-Options` and `X-Content-Type-Options` at the host
- Register the domain and swap the canonical/OG URLs
