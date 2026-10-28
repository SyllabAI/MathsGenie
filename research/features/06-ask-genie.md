# Feature 06 — Ask Genie AI

## Behaviour on original

1. `/ask-genie` — "Meet Genie, your AI study partner" — chat assistant across all subjects.
2. Positioned capabilities (homepage sections): always available; "know exactly where you stand" (progress feedback); detailed feedback on papers & topics (demo shows `61/80` feedback with strengths list).
3. Auth-gated (Sign up flows route through `/auth/signup?redirectTo=…`).

## Evidence

- ask_genie.html (305 KB): chat shell layout; header CTA; homepage demo sections ("Meet GenieYour AI Study Partner", "Always Available, Never Judges", "Know Exactly Where You Stand", "Get detailed feedback on your papers & l…", "61/80").
- The chat payloads are authenticated client APIs — not captured (out of scope: ToS + it's their product IP).

## Recreation

- `src/app/ask-genie/page.tsx` — full chat UI shell: message list, composer, suggested prompts ("Explain factorising", "Plan my week", "Mark my method"), typing indicator.
- Local demo mode only: canned responses explaining that the live Genie backend is proprietary; every conversation carries an attribution note + link to the real `/ask-genie`.
