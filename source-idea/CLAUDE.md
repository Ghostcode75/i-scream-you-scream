# CLAUDE.md — Ice Cream Man Request App

## Project Overview

**“I Scream, You Scream”** — A neighborhood ice cream truck request app for Cedar City, Utah and surrounding areas. Built by Cedar City Web Design (Lighting Software Development LLC) as a free community tool for a local ice cream vendor. The app serves as both a functional tool for the vendor and a local advertising piece for CCWD.

**Business Model:** Free for the ice cream vendor. CCWD gets branding/footer credit on every page. The app gets shared organically through local Facebook groups (Cedar City Community, Enoch Neighbors, etc.), generating visibility and leads for CCWD.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Hosting:** Vercel
- **Database:** Vercel KV (Redis) for request queue and truck status
- **Auth:** Simple PIN-based driver dashboard (no user auth needed for customers)
- **Styling:** Tailwind CSS
- **Icons:** Tabler Icons (`ti ti-*`) + Phosphor Icons (`ph ph-*`) — never Lucide, Feather, or Heroicons
- **Domain:** TBD — likely a subdomain or standalone domain

## Icon Rules

- Mixed Tabler Icons (`ti ti-*`) + Phosphor Icons (`ph ph-*`, with weights ph-thin/ph-light/ph-bold/ph-fill/ph-duotone)
- Best icon wins per concept; never use both libraries’ version of the same icon on one page
- Never use Lucide, Feather, or Heroicons
- Never use emojis as UI icons (emojis OK for treat/food display, reactions, and playful content — not for navigation, buttons, or status indicators)
- Both icon libraries are MIT licensed, 24px grid

## Core Features

### 1. Customer Request Flow (Public)

- **Area picker:** Cedar City North/South/East/West, Enoch, Kanarraville, Parowan, Summit, Brian Head, Cedar Highlands
- **Street/cross-street input** with optional name
- **Treat pre-order menu** with quantities and running total (soft serve, sundaes, bomb pops, shakes, floats, snow cones, etc.)
- **Neighbor rally counter** — more households = higher priority routing for the driver
- **“Ring the Bell” submit** — plays a short jingle (Web Audio API triangle wave melody)
- **Confirmation screen** with ETA (varies by area), pre-order receipt, and share buttons

### 2. Share / Neighbor Invite

- **Facebook share button** — pre-filled post text
- **Copy to clipboard** — shareable message
- **Text a Neighbor** — opens SMS compose with pre-filled body
- Share message format: “🍦 I just requested the Ice Cream Man to [area]! Get yours too — [app URL]”

### 3. Live Truck Tracker (Public)

- **Visual area grid** showing truck’s current location (pulsing indicator)
- **Demand heatmap** by area — shows which neighborhoods have the most pending requests
- **Demand bar chart** ranking areas by household count
- **Truck status banner** — “Truck is rolling!” or “Truck isn’t out right now”
- Polls for updates every 6-8 seconds via Vercel KV

### 4. Community Feed (Public)

- **Real-time request feed** showing all recent requests
- **Status pills:** Waiting (yellow), On the Way (green), Served (gray)
- Displays name, area, street, household count, pre-order count, and time ago
- Badge on tab shows pending request count

### 5. Driver Dashboard (PIN-Protected)

- **PIN entry** — configurable via env var, default “1234”
- **Truck status controls:** Start Shift (pick starting area), move between areas, End Shift
- **Area chips** with demand counts — tap to update truck location (broadcasts to all users)
- **Priority Areas** ranked by demand with fire indicators
- **Pending request queue** sorted by household count (highest priority first)
  - Shows name, area, street, household count, pre-order details with treat breakdown
  - Accept (✓) or Dismiss (✗) buttons
- **En Route list** — accepted requests with “Done” button
- **Shift Stats:** Served count, Waiting count, En Route count, Total pre-order revenue

## Data Model (Vercel KV)

### Request Object

```json
{
  "id": "abc12345",
  "area": "enoch",
  "street": "200 N & Main",
  "name": "David",
  "treats": { "cone": 2, "shake": 1 },
  "totalItems": 3,
  "totalPrice": 11,
  "neighbors": 3,
  "status": "pending",
  "ts": 1718000000000
}
```

Status values: `pending` → `accepted` → `completed` (or `pending` → `completed` for dismissals)

### Truck Status Object

```json
{
  "active": true,
  "area": "cc-north",
  "heading": "enoch",
  "startedAt": 1718000000000
}
```

### KV Keys

- `icecream:requests` — JSON array of last 150 requests
- `icecream:truck` — JSON truck status object
- `icecream:stats:{date}` — daily stats (optional, for future analytics)

## API Routes

```
POST /api/request        — Submit a new request
GET  /api/requests       — Get all requests (with optional status filter)
PATCH /api/request/[id]  — Update request status (driver only, PIN required)
GET  /api/truck          — Get truck status
PATCH /api/truck         — Update truck status (driver only, PIN required)
```

All driver-mutating endpoints require `x-driver-pin` header matching env var `DRIVER_PIN`.

## Areas Reference

|ID             |Name            |Short       |ETA (min)|
|---------------|----------------|------------|---------|
|cc-north       |Cedar City North|CC North    |10       |
|cc-south       |Cedar City South|CC South    |10       |
|cc-west        |Cedar City West |CC West     |12       |
|cc-east        |Cedar City East |CC East     |10       |
|enoch          |Enoch           |Enoch       |18       |
|kanarraville   |Kanarraville    |Kanarraville|22       |
|parowan        |Parowan         |Parowan     |25       |
|summit         |Summit          |Summit      |20       |
|brian-head     |Brian Head      |Brian Head  |35       |
|cedar-highlands|Cedar Highlands |Highlands   |15       |

## Treats Menu

|ID       |Name              |Price|
|---------|------------------|-----|
|cone     |Soft Serve Cone   |$3   |
|dipped   |Dipped Cone       |$4   |
|sundae   |Sundae            |$5   |
|pop      |Bomb Pop          |$2   |
|drumstick|Drumstick         |$3   |
|sandwich |Ice Cream Sandwich|$3   |
|shake    |Milkshake         |$5   |
|float    |Root Beer Float   |$4   |
|banana   |Banana Split      |$6   |
|snow     |Snow Cone         |$3   |
|mochi    |Mochi Ice Cream   |$4   |
|cookie   |Cookie Dough Bites|$3   |

**NOTE:** Menu items and prices should be easily configurable — the vendor will want to adjust these. Consider a `config/menu.ts` file or env-driven config. The vendor may also want to add/remove items seasonally.

## Design Direction

- **Palette:** Warm cream backgrounds (#FFF8F0, #FFE8D6), charcoal text (#3A2D1E), ice cream truck red (#E84B3A) as primary accent, golden yellow (#FFD93D) secondary, mint green (#8FD8A8) for success states
- **Typography:** Rounded, playful display font (Fredoka or Nunito) for headers. Clean sans-serif for body.
- **Vibe:** Nostalgic summer ice cream truck meets modern mobile app. Warm, inviting, family-friendly. Not corporate.
- **Mobile-first:** This will primarily be used on phones from Facebook group links. Must be fast, thumb-friendly, and look great in the Facebook in-app browser.
- **Signature element:** SVG ice cream truck illustration used throughout. Jingle sound on submission.

## Branding / Footer

Every page includes a subtle footer:

```
Built with ❤️ for Cedar City by Cedar City Web Design
cedarcitywebdesign.com
```

Link to cedarcitywebdesign.com. Keep it tasteful — it’s advertising, not a billboard.

The vendor’s business name and logo should be prominently featured in the header/hero area. Placeholder until we get their branding assets.

## Environment Variables

```env
KV_REST_API_URL=         # Vercel KV connection
KV_REST_API_TOKEN=       # Vercel KV token
DRIVER_PIN=1234          # PIN for driver dashboard access
NEXT_PUBLIC_APP_URL=     # Public URL for share links
VENDOR_NAME=             # Ice cream vendor's business name
VENDOR_PHONE=            # Vendor contact (optional, for "Call the truck" feature)
```

## Future Enhancements (Phase 2)

- **Push notifications** via web push when truck enters your area
- **SMS notifications** via Telnyx when your request is accepted
- **Actual GPS tracking** — driver shares location, customers see real map
- **Schedule page** — weekly route schedule so people know when to expect the truck
- **Reviews/ratings** — customers rate their experience
- **Analytics dashboard** — daily/weekly stats for the vendor
- **Multi-vendor support** — if more vendors want in
- **Stripe/Square integration** — pre-pay at order time
- **Neighborhood leaderboard** — which area orders the most each week

## File Structure

```
app/
├── layout.tsx              # Root layout with fonts, meta, analytics
├── page.tsx                # Main app (tabbed interface)
├── api/
│   ├── request/
│   │   ├── route.ts        # POST new request, GET all requests
│   │   └── [id]/
│   │       └── route.ts    # PATCH request status
│   └── truck/
│       └── route.ts        # GET/PATCH truck status
├── components/
│   ├── RequestFlow.tsx     # Multi-step request wizard
│   ├── TruckTracker.tsx    # Live tracking view
│   ├── CommunityFeed.tsx   # Request feed
│   ├── DriverDash.tsx      # PIN-protected driver dashboard
│   ├── TruckSVG.tsx        # SVG truck illustration
│   ├── TabBar.tsx          # Bottom navigation
│   ├── ShareButtons.tsx    # Facebook/SMS/Copy share actions
│   └── Jingle.tsx          # Web Audio jingle player
├── config/
│   ├── areas.ts            # Area definitions
│   └── menu.ts             # Treat menu (easily editable)
├── lib/
│   ├── kv.ts               # Vercel KV helpers
│   └── types.ts            # TypeScript types
└── public/
    ├── og-image.png        # Open Graph image for Facebook shares
    └── favicon.ico
```

## Open Graph / Social Sharing

Critical for Facebook group virality. Every page needs proper OG tags:

```html
<meta property="og:title" content="🍦 Request the Ice Cream Man — Cedar City" />
<meta property="og:description" content="Ring the bell and the Ice Cream Man heads to your street. Cedar City & surrounding areas." />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content="https://[domain]" />
```

The OG image should be eye-catching — truck illustration, bright colors, “Ring the Bell!” CTA. Size: 1200x630px.

## Development Notes

- The working prototype is in the artifact file `icecream-man.jsx` — port the UI logic and styles from there
- Treat menu prices are placeholders — confirm with the vendor
- Area ETAs are rough estimates — vendor will refine based on actual routes
- The jingle uses Web Audio API triangle waves — no audio files needed
- Polling interval for live updates: 6-8 seconds (balance between freshness and KV read costs)
- Keep request history capped at ~150 entries to control KV storage size
- Vercel KV free tier: 30k requests/month, 256MB storage — should be fine for Cedar City scale