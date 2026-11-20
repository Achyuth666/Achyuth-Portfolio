# BRIEF — "Latent Space"

Phase 1, step 1. Written with Elaya's `landing-page-design` (Part A: intake, structure, conversion,
copy). Where the skill's Part B visual rules contradict `CLAUDE.md`, the design laws win (see
"Skill conflicts" at the end).

## Intake

| Question | Answer |
| --- | --- |
| Audience (ICP) | Recruiters and engineering leads hiring AI / GenAI / MLOps engineers in Bengaluru |
| What they know on landing | A name from a resume, LinkedIn or referral. They skim for about 6 seconds before deciding to stay |
| Primary action | **Download resume**. Secondary actions: **Ask my AI** (chat) and **Email me** |
| What counts as a conversion | A resume download, a chat with at least one question, or a `mailto:` / contact form send |
| Top objection | "A fresher can't ship production AI" |
| Other objections | "Is the work real or a tutorial clone?" · "Can he work on a team with production constraints?" · "Is he available, and in Bengaluru?" |
| Answer to the objection | Deployed systems with real traffic, a public `/evals` page, a live GitHub feed, and two industry roles. Shown, not claimed |
| Traffic sources | Resume link, LinkedIn profile, GitHub profile, direct referral |
| Voice | Professional, plain, confident. Short sentences. No hype words |
| Design direction | Minimal editorial, strictly monochrome (ink on paper), immersive but never in the way |
| Mobile priority | High. Recruiters open links from LinkedIn on phones |

## Layout choice

**A. Classic hero plus sections**, with a **Recruiter Mode** that collapses to **C. Minimal
conversion page**. The work is understood from the hero line plus proof, so a long-form story
is unnecessary. The ten mandatory sections act as the argument. Recruiter Mode is the fast path
for the 6-second skim.

## Conversion rules applied

- **One primary CTA above the fold:** "Download resume" (filled ink block). "Ask my AI" sits
  beside it as a quiet secondary (hairline). Email lives in the contact icons, not as a third button.
- **Proof beside the claim:** every headline below is paired with the proof that backs it, inside
  that same section. Nothing waits for a testimonials section (there will be none; we invent none).
- **Risk reversal for a recruiter** is speed and certainty: Recruiter Mode, a one-click PDF, a
  stated availability line ("Open to AI / GenAI / MLOps roles in Bengaluru, from {{start_date}}").
- **Final CTA mirrors the top:** the Contact section repeats "Download resume" and "Email me".

## Section order

Hero, then the ten mandatory sections. Each gets a nav anchor (`#about` … `#contact`) and a ⌘K
entry. None are merged or dropped.

| # | Section | Anchor | ⌘K label |
| --- | --- | --- | --- |
| 0 | Hero / Inference | `#top` | Go to top |
| 1 | About me | `#about` | About |
| 2 | Education | `#education` | Education |
| 3 | Experience | `#experience` | Experience |
| 4 | Featured projects | `#work` | Selected work |
| 5 | Tech stack | `#stack` | Tech stack |
| 6 | Certificates | `#certificates` | Certificates |
| 7 | Achievements | `#achievements` | Achievements |
| 8 | Extra-curriculars | `#off-the-keyboard` | Off the keyboard |
| 9 | Ask my AI | `#ask` | Ask my AI |
| 10 | Contact | `#contact` | Contact |

**Recruiter Mode order** (single column, print-friendly, zero WebGL): About, Contact, Education,
Experience, Featured projects, Tech stack, Certificates, Achievements, Extra-curriculars, Ask my
AI (as a link). Contact moves up because that is what a recruiter needs second.

**Tagline moment** (from the skill's B11): one large-type interstitial between Experience and
Featured projects, not a section of its own and not in the nav. Words go from `ink/30` to full ink
one by one on scroll. Reduced motion shows it at full tone.

> I don't demo AI.
> I put it *in production* and keep it there.

(Exception noted: this is the one display line with a two-word italic phrase. If that breaks the
law in review, use "I put it *live* and keep it there.")

## Headlines and proof

Headlines are sentence case, one serif display line, **exactly one italic word** (shown as
`*word*`). Eyebrows are Geist Mono labels. `{{…}}` marks a fact Achyuth must supply; nothing here
is invented.

### 0. Hero

- **Eyebrow:** `AI ENGINEER · GENAI · AGENTIC AI · MLOPS · BENGALURU`
- **Headline:** I build AI that *ships*.
- **Subheadline:** Achyuth Sreenath. Agentic systems, RAG and voice AI, deployed and evaluated.
  Currently at LS OptimAIze, Bengaluru.
- **CTA:** Download resume (primary) · Ask my AI (secondary)
- **Proof signal (one line, mono):** `VOICE AI IN PRODUCTION · 300–400 CALLS/MONTH · EVALS PUBLIC AT /EVALS`
- **Visual:** particle portrait (Phase 4). Static dithered portrait or "A" monogram until then.

### 1. About me

- **Headline:** Engineer first, *fresher* second.
- **Body (3–4 lines, serif):** I'm a final-year B.Tech student in AI & ML who already works on
  production AI at a Bengaluru startup. I build the unglamorous parts too: queues, evals,
  monitoring, the retry logic nobody demos.
- **Proof:** "Currently" lines (LS OptimAIze, Bengaluru · final-year B.Tech, VIT Bhopal · open to
  AI / GenAI / MLOps roles). Bento: location, building now ({{current_project}}), Oracle GenAI
  Professional, MC at international events.
- **Objection handled:** names the objection head-on and answers with a current job.

### 2. Education

- **Headline:** Trained in theory, tested in *production*.
- **Proof:** B.Tech CSE (AI & ML), VIT Bhopal, {{start_year}}–{{end_year}}. CGPA {{cgpa}} (only if
  Achyuth chooses to show it). Coursework: ML, DL, NLP, MLOps, cloud. Capstone: the AutoML
  Platform, linked to its case study.

### 3. Experience

- **Headline:** Two teams, real *users*.
- **Proof:** LS OptimAIze (Bengaluru), {{role}}, {{dates}}: production outbound voice AI handling
  300–400 calls a month (Deepgram, ElevenLabs, LiveKit, Redis, FastAPI); Chattiq multi-tenant AI
  platform; {{impact_bullet_3}}. ElevateTrust AI, Software Developer AI Intern, {{dates}}:
  {{impact_bullets}}. Client work shown by name only if approved (open question in PLAN.md).
- **Objection handled:** production constraints, team work, real users.

### 4. Featured projects

- **Headline:** Selected *work*.
- **Proof:** case studies in problem → approach → architecture → metrics → what broke → links:
  AutoML Platform (14+ agents, LangGraph, Celery/Redis, MLflow, DVC, Kubernetes on EKS, Evidently
  AI), AstraRAG (deployed multi-agent RAG), voice AI, CCTV video intelligence (fine-tuned YOLOv8).
  Plus the AutoML agent graph, "Fresh from GitHub" (auto-synced repos) and live GitHub telemetry.
- **Objection handled:** "Is it real?" Live demos, repos and a feed that updates itself.

### 5. Tech stack

- **Headline:** Tools I've *broken* and fixed.
- **Proof:** the physics pile, then the grouped list: LLMs & agents (LangGraph, RAG, Groq, Gemini),
  ML/DL (PyTorch, YOLOv8), MLOps (MLflow, DVC, Evidently AI, Docker, Kubernetes), backend
  (FastAPI, Celery, Redis, PostgreSQL, MongoDB), cloud (AWS EKS, S3), frontend (Next.js, React).
  No skill bars, no percentages.

### 6. Certificates

- **Headline:** Verified, not *claimed*.
- **Proof:** credential cards with issuer, date, credential ID and a Verify link. Oracle Generative
  AI Professional pinned first. Others: {{certificates}}.
- Placed after projects on purpose (certificate walls above projects read as junior).

### 7. Achievements

- **Headline:** On the *record*.
- **Proof:** serif numerals with a date and a proof link each: {{achievements}}. Count-up only on
  real numbers supplied by Achyuth. An empty state ("More soon") beats a padded list.

### 8. Extra-curriculars

- **Headline:** Off the *keyboard*.
- **Proof:** Master of Ceremonies at international events ({{event}}, {{year}}, audience
  {{audience_size}}), as a grainy monochrome photo strip. Clubs and volunteering: {{roles}}.
- **Objection handled:** communication. An engineer who can hold a room can explain a model to a
  client.

### 9. Ask my AI

- **Headline:** Ask my *AI*.
- **Subheadline:** It answers from my resume, LinkedIn and GitHub, cites its sources, and says
  "I don't know" when it doesn't.
- **Proof:** source chips on every answer, a "show retrieved context" toggle, and the eval score
  card linking to `/evals` (real numbers from Phase 9 only).
- **Suggested questions:** "What's his strongest project?" · "Is he open to roles in Bengaluru?" ·
  "Explain his AutoML agent graph" · "What has he shipped to production?"
- **Objection handled:** the site is itself a deployed, evaluated RAG system.

### 10. Contact

- **Headline:** Let's build something *real*.
- **CTA:** Download resume · Email me (mailto + copy)
- **Proof / links:** Email, Phone (tap to reveal, `tel:` and WhatsApp), LinkedIn, GitHub,
  Instagram. The "API request" contact form (`POST /hire-achyuth`, live JSON preview, Turnstile).
- **Final CTA mirrors the hero.**

## FAQ (for the chatbot's suggested prompts and FAQ schema)

1. **Is Achyuth open to full-time roles?** Yes, AI / GenAI / MLOps roles in Bengaluru, from {{start_date}}.
2. **Has he shipped AI to production?** Yes. A voice AI system at LS OptimAIze handles 300–400 calls a month.
3. **What does he build best?** Agentic workflows (LangGraph), RAG with evals, voice AI.
4. **Can he own deployment?** Docker, Kubernetes on EKS, MLflow, DVC and monitoring with Evidently AI, all used in the AutoML Platform.
5. **How do I know the chatbot is accurate?** Its answers cite sources, and the eval suite is public at `/evals`.
6. **When does he graduate?** {{graduation_month_year}}.
7. **Where is the resume?** One click from the hero, the contact section and ⌘K.

## SEO / AEO

**Index.** Evergreen personal page with search intent ("Achyuth AI engineer", "AI engineer
Bengaluru portfolio").

- **Title:** Achyuth Sreenath — AI Engineer, Bengaluru
- **Meta description:** AI engineer building agentic systems, RAG and voice AI that ship to
  production. Resume, case studies and a chatbot you can question.
- FAQ above as `FAQPage` schema; `Person` schema with `sameAs` links.

## Skill conflicts (design laws win)

| `landing-page-design` rule | Our rule (`CLAUDE.md`) |
| --- | --- |
| One typeface, never italics | Serif display + Geist Sans + Geist Mono; exactly one italic word per headline |
| Hero heading gradient | No gradients anywhere |
| Dark mode greys `#181818` etc. | Only `#0A0A0A` / `#F5F3EE`, greys from opacity |
| B7 base motion 500ms for layout | UI transitions < 300ms (Emil); 500–800ms only for scroll reveals and the ink spill |
| Phosphor / Solar / Iconamoon icons | Kept: Phosphor, in monochrome |
| Spacing scale, no hyphens in copy, sentence case, `text-wrap: balance`, no invented facts, full state sets | Adopted as is |

## Facts Achyuth must supply

`{{start_date}}`, `{{graduation_month_year}}`, `{{start_year}}`, `{{end_year}}`, `{{cgpa}}` (optional),
`{{role}}` and `{{dates}}` for both jobs, impact bullets with real numbers, `{{certificates}}`,
`{{achievements}}`, MC `{{event}}` / `{{year}}` / `{{audience_size}}`, `{{roles}}`,
`{{current_project}}`, and permission to name client work.
