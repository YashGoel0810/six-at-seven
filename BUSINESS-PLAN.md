# Six at Seven — business plan

Status: concept, pre-launch. Nothing here is measured. Every number below is an
assumption with its reasoning shown, so you can attack the reasoning rather than
argue with a spreadsheet.

---

## 1. The thesis in one paragraph

Founders in Delhi NCR are surrounded by "networking" and starved of company.
Every room they walk into is transactional — a demo day, a fund's portfolio
mixer, a WhatsApp group that dies on day three. What is missing is a low-stakes,
repeatable, high-trust table: five peers at a similar altitude, no one selling
anything, once a week, organised by someone else. Six at Seven sells the
organising, not the people.

The model is already proven for consumer social (Timeleft runs it globally,
oddtables in Delhi). Nobody has run it as a **vertical for founders**, where the
matching constraints are sharper (no competitors, no investors, no one from your
cap table) and the willingness to pay is several times higher.

## 2. Why founders, specifically

| Consumer version | Founder version |
|---|---|
| Solves loneliness | Solves loneliness **and** isolation of decision-making |
| ₹1,500–2,000/mo is a discretionary spend | ₹2,500/mo is a rounding error against a founder's P&L, often expensable |
| Match on personality | Match on personality **plus** stage, sector-distance, and conflict rules |
| Churn when the novelty fades | Retention compounds as the table becomes a peer group |
| Hard to price up | Clear upgrade path: curated tables, retreats, corporate-sponsored tables |

The defensible part is not the dinner. It is the **matching constraint set** and
the reputation for enforcing it. Anyone can book a restaurant; very few can
credibly promise "no competitor, no investor, nobody from your circle, checked by
a person."

## 3. Product

**Core loop.** Quiz (8 questions, 4 min) → matching engine drafts a table of six
→ a human reviews and approves → WhatsApp invite with neighbourhood and table
shape → member says yes/no → venue revealed the morning of → dinner Thursday 7pm
→ post-dinner one-question feedback that feeds the next match.

**Deliberately excluded**, because each one degrades trust:
- No profiles or photos. Removes filtering by prestige.
- No pitching, no recording, no adding people to a CRM. Stated at signup.
- No investors seated undercover. Funds may host a named table, announced.
- No markup on food. The restaurant bills the member directly.

**Matching rules (v1, hand-tunable):**
1. Stage band — pre-revenue / early revenue / scaled. Never mix the ends.
2. Sector distance — no two direct competitors, minimum one industry apart.
3. One "further along" seat per table where supply allows.
4. One deliberate disagreement seat, from the conflict-style questions.
5. Exclusions — same company, same cap table, same accelerator batch, phone
   contacts overlap.

Rule 5 is the operationally hard one and the one worth being famous for.

## 4. Market sizing (assumption-led, top-down then sanity-checked)

- Registered startups in Delhi NCR: roughly 15,000–20,000 DPIIT-recognised
  entities, plus a large unregistered long tail.
- Assume ~25,000 people who genuinely self-identify as founders in NCR.
- Serviceable slice: urban, 25–45, willing to cross the city on a weeknight,
  comfortable paying a subscription → assume 20% = **5,000**.
- Realistic obtainable in 18 months at 5% of that = **250 paying members**.

Sanity check from the supply side: 250 members × 2 dinners a month each = 500
seats = ~83 tables a month = ~21 tables a Thursday. That needs 21 simultaneous
venue slots in NCR, which is comfortably available across three neighbourhoods.
The constraint is matching quality and ops headcount, not demand or restaurants.

## 5. Unit economics

Assumptions, monthly, per member:

| Line | Value | Reasoning |
|---|---|---|
| Revenue | ₹2,499 | Below a good dinner-for-two; above impulse, so it filters |
| Payment gateway | −₹50 | ~2% |
| Venue/ops cost | −₹0 | Member pays the restaurant directly |
| Host/ops labour | −₹250 | ~1 ops person per 150 members at ₹35k/mo |
| Venue relationship + comms | −₹100 | WhatsApp API, scheduling tooling |
| Tooling/infra amortised | −₹80 | Site, DB, matching, dashboards |
| **Contribution margin** | **≈ ₹2,019 (81%)** | |

CAC assumption: ₹800–1,200 blended in the early months (founder communities and
referral are cheap; paid Instagram is not). At ₹1,000 CAC and 81% margin,
**payback is under one month** — which is the whole reason this model is
attractive versus an events business.

LTV: the key unknown. Consumer versions of this see heavy churn at months 3–4.
Assume a conservative 5-month average life → LTV ≈ ₹10,000, LTV:CAC ≈ 10:1.
If real churn is worse — say 2.5 months — it is ≈ 5:1, still viable. **The number
to instrument from dinner one is month-3 retention.** Everything else is noise
until that is known.

## 6. Revenue model and expansion

1. **Membership** — ₹2,499/mo. The base.
2. **Annual** — ₹24,999 (two months free). Fixes cash flow and churn optics.
3. **Curated tables** — ₹7,500–15,000 a seat for a themed table with a named
   operator present (a fundraising table, a first-hire table). High margin,
   run monthly, and it is the upsell that makes the base price look cheap.
4. **Sponsored tables** — a bank, a cloud provider or a fund pays ₹1.5–3L to
   host a named table series. Must be announced; the moment it is disguised,
   the core promise dies.
5. **Retreats** — a weekend, once a year, ₹25–40k a head. Later.

Deliberately not doing: taking a cut of the restaurant bill (misaligns venue
selection), or selling the member list (kills the product outright).

## 7. Go to market

**Phase 0 — 8 weeks, prove the dinner.**
Run 8 free tables. The only goal is measuring whether people come back. Success
bar: ≥60% of attendees say yes to a second table within three weeks.

**Phase 1 — months 3–6, prove the price.**
Charge from table one. Target 60 paying members. Channels, in order of expected
efficiency:
- Direct outreach to founder communities in NCR and existing WhatsApp groups
- Referral: a member who brings a founder gets a month free, and they are never
  seated together (rule 5 is also the referral mechanic)
- Instagram/LinkedIn organic — the visual of a table of six is the ad
- A waitlist with a visible city counter, which makes scarcity honest

**Phase 2 — months 7–18, prove it scales.**
250 members in NCR, then Bengaluru. Only open a city once the NCR table-fill
rate is above 85% — a half-empty table is worse than no table.

## 8. Operations

Per week, per table: draft the match (automated), human review (~5 min/table),
send invites, chase non-responders, confirm the restaurant, send the reveal,
collect one-line feedback. Roughly **25–30 minutes of human time per table**.

At 20 tables a week that is ~10 hours — one part-time ops person. This is the
number that decides whether the business is pleasant or miserable, so it should
be tracked from week one, and automation effort should be spent here before
anywhere else.

Venue model: 8–12 partner restaurants across South Delhi, Gurgaon and Noida.
Quiet enough to hear the far end of a six-top, reservable at 7pm Thursday, and
ideally happy to hold a standing slot in exchange for guaranteed covers.

## 9. Risks, honestly

| Risk | Severity | Mitigation |
|---|---|---|
| Churn after the novelty (months 3–4) | **Highest** | Instrument from day one; ship the curated-table upsell before month 3 |
| Supply thinness early — bad first tables | High | Do not open a city until 40+ members; cancel a table rather than seat a bad four |
| It becomes a networking event anyway | High | Enforce the no-pitch rule; remove repeat offenders and say publicly that you do |
| A founder meets a competitor | High | Rule 5 is the promise; one failure is a refund plus a public post-mortem |
| Ops does not scale past ~200 members | Medium | Track minutes-per-table weekly; automate matching before hiring |
| No-shows wreck a six-top | Medium | Confirm 24h before; a second no-show without notice costs the membership |
| Copycat | Low | The rules and the reputation for enforcing them are the moat, not the format |

## 10. Financial sketch — 18 months

| | M6 | M12 | M18 |
|---|---|---|---|
| Members | 60 | 150 | 250 |
| MRR | ₹1.5L | ₹3.7L | ₹6.2L |
| Contribution (81%) | ₹1.2L | ₹3.0L | ₹5.0L |
| Fixed cost (1.5 FTE + tools) | ₹1.1L | ₹1.6L | ₹2.4L |
| **Monthly net** | **≈ breakeven** | **≈ ₹1.4L** | **≈ ₹2.6L** |

Plus curated tables and sponsorship, which are not in the table above and are
where the upside actually lives.

Capital needed to reach M6: roughly **₹3–4L** — eight free pilot dinners,
three months of part-time ops, and a small paid-acquisition test. This is a
business that should be bootstrapped; raising money for it before month-3
retention is known would be raising money to find out if the product works.

## 11. What to do next, in order

1. Run one dinner. Not eight, one. Pay for it yourself.
2. Ask every attendee one question afterwards: would you do this again next week?
3. If fewer than 4 of 6 say yes, the matching is wrong — fix that before
   anything else on this page matters.
4. Only after three consecutive tables clear that bar: charge, then build the
   quiz backend and wire this site's form to it.

The site in this repo is step 4's front door. It is deliberately ahead of the
business so the business has something to point at — but it should not collect
money until the dinner has been proven to work.
