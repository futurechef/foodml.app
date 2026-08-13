# foodml.app — FoodML enterprise sales page

Marketing/sales site for **FoodML**, the white-label kitchen OS. This repo holds
the static enterprise landing page (`index.html`) that pitches the platform
behind [`futurechef/mise`](https://github.com/futurechef/mise) to white-label
enterprise buyers.

- **Product source of truth:** the `mise` repo (the actual kitchen OS — Supply,
  AutoMenu agent, Safety logs, BEO, signage, guest portals). This repo is
  content only; every product claim on the page is grounded in what `mise`
  ships today (see its `CLAUDE.md`).
- **The page is fully self-contained:** one `index.html`, inline CSS, no build
  step, no external fonts or scripts. Open it in a browser to preview; deploy
  it to any static host.

## Deploying

Any static host works (Firebase Hosting, Cloud Storage + LB, Netlify, Vercel).

⚠ **Do NOT repoint the existing `foodml` Firebase Hosting site at this repo.**
`foodml.web.app` is the friendly URL for the *Mise app itself* (it rewrites `**`
to the `mise` Cloud Run service — see `mise/CLAUDE.md`). This sales page needs
its own Hosting site (e.g. `foodml-www`) or the real `foodml.app` custom domain
on a new site:

```
firebase hosting:sites:create foodml-www --project fork-50b48
# firebase.json (in this repo, when deploying):
#   { "hosting": { "site": "foodml-www", "public": ".", "ignore": ["README.md", ".git/**"] } }
firebase deploy --only hosting:foodml-www
```

If `foodml.app` (the custom domain) is later attached to a Hosting site, add it
to Firebase Auth's authorized domains only if the site ever hosts sign-in — a
static sales page doesn't need it.

## Editing

Everything lives in `index.html`. Sections, top to bottom: hero → proof strip →
live deployments → platform modules → white-label config story → safety
guardrails → enterprise ops → engagement tiers (Pilot / Rollout / Platform) →
demo CTA. Colors/typography are CSS variables in `:root`, echoing Mise's
sage/clay palette.
