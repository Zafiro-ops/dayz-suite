# Map Data Source — Open Question

Production map tile assets for DAYZ SUITE MAPS are **unresolved** as of this milestone.

## What is blocked

The interactive map component requires:

- Map tiles (rasterized PNG/WebP images for each zoom level and grid position)
- Map bounds and coordinate reference data for Chernarus
- A confirmed tile hosting strategy (CDN, self-hosted, third-party)

## Why this must be resolved before Milestone 2

No map tiles may be downloaded, copied, hotlinked, scraped, or derived from the
following sources without explicit written permission and a verified compatible license:

- **iZurvive** (izurvive.com) — proprietary tile set; terms prohibit scraping or redistribution
- **DayZ XAM** — proprietary; no open license
- **Bohemia Interactive official game assets** — covered by the Bohemia Interactive EULA;
  fan/mod use has restrictions that may not extend to monetized web products
- **Steam Workshop assets** — Steam Subscriber Agreement applies
- **Community-hosted tile mirrors** — license varies; usage on a monetized platform requires
  explicit permission from the original author

## Options to evaluate

1. **Render tiles from the official DayZ SDK or modding tools** — requires review of
   Bohemia Interactive's fan-site and modding policy to confirm commercial use is permitted
2. **Commission custom tile rendering from a licensed source** — provides a clear commercial path
3. **Negotiate directly with an existing community map provider** — requires a written agreement
4. **Generate tiles from open terrain/satellite data with custom DayZ POI overlay** — avoids
   game asset copyright but may reduce visual fidelity

## Action required before Milestone 2

The project owner must:

1. Identify the tile source
2. Confirm usage rights for a public, ad-monetized web product
3. Confirm rights if a premium or subscription tier is added in future
4. Document the chosen license and link to the agreement in this file

**Do not integrate any tile assets until the above steps are completed and documented.**
