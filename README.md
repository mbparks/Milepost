# MILEPOST

**Field Instrument 003** / Environmental Capture & Journal

A single-file web instrument that takes an environmental fix of the world at the moment of an entry and binds that snapshot to a written observation. Each entry becomes a milepost: a fixed marker along the route you are walking through time.

Version 0.0.9 / Green Shoe Garage / Mountain Maryland

---

## What it captures

When you press **NEW ENTRY**, the instrument queries dozens of distinct sources to assemble a snapshot, running them concurrently after first establishing your location. Each source captures independently and fails gracefully. The capture log shows live status (pending, working, captured, unavailable, key required) for every source.

**Location** via browser geolocation, with IP-based fallback after a 4-second timeout.

**Atmospheric** conditions, temperature, apparent temperature, humidity, dewpoint, pressure, wind (speed, direction, gusts), cloud cover, precipitation, visibility, current UV index, US AQI, pollen counts for six taxa where regionally available (Open-Meteo), and weekly CO₂ concentration at Mauna Loa with year-over-year change (NOAA Global Monitoring Laboratory).

**Celestial** sun sign, sun altitude and azimuth, moon phase with illumination percentage and lunar age, sunrise, sunset, civil and astronomical twilight times, day length, currently-active meteor showers with peak-day flagging, next solar or lunar eclipse with countdown, days until the next equinox or solstice, Julian day, plus a recorded URL for the current NASA SDO solar disk image (Meeus algorithms computed locally; sunrise-sunset.org; NASA SDO; client-side meteor/eclipse tables through 2030).

**Space Weather and Orbital** Kp index with geomagnetic activity classification, solar wind speed, plasma density and temperature, aurora visibility probability at your coordinates (the OVATION model's 30-minute forecast), ISS lat/lon/altitude/velocity (NOAA SWPC, WhereTheISS.at).

**Telluric** nearest seismic event within 500km with magnitude, place, depth, and time since; count of nearby M1.5+ events; largest M4+ event globally in the last 24 hours; wildfire thermal anomalies within 500km with distance and fire radiative power (USGS Earthquake Hazards Program, NASA FIRMS).

**Hydrosphere** nearest active USGS stream gauge with discharge in cubic feet per second and gauge height in feet; nearest NOAA tide station with water level relative to MLLW, or "inland" status with distance to the closest coastal station (USGS NWIS, NOAA CO-OPS).

**Biosphere** bird species diversity within 50km over the past 3 days, up to three notable or rare sightings from the past 7 days with locations and counts, and the latest observation (eBird).

**Markets** Dow Jones, S&P 500, NASDAQ Composite, and VIX with day change in points and percent; 5-year, 10-year, and 30-year US Treasury yields with the 10y-5y spread flagged inverted or normal; gold, silver, and WTI crude oil futures with day change (all via Yahoo Finance); BTC, ETH, and XMR vs USD with 24h change (CoinGecko); the Crypto Fear & Greed index (alternative.me); USD exchange rates for EUR, GBP, JPY, and CAD (Frankfurter).

**Cultural Pulse** top song, album, app, podcast, and book from Apple's charts (Apple Marketing Tools RSS); current US box office number-one film with weekend gross (Wikipedia).

**Discourse** the most-read Wikipedia article today with view count and description, Wikipedia's "In the News" headline, the top Hacker News story with score and comment count, and the top r/popular post with subreddit and score (Wikipedia REST API, HN Firebase, Reddit JSON).

**Curio** NASA Astronomy Picture of the Day with title and excerpt, the latest xkcd with title and alt text, the most recent arXiv submission across cs.AI / cs.CL / astro-ph.SR / physics.hist-ph with abstract excerpt, and the most-starred new GitHub repository from the past week (NASA APOD, xkcd JSON, arXiv API, GitHub Search API).

**On This Day** three historical events from this calendar date, drawn from across the centuries (Wikipedia).

Each captured entry is labeled with a small SVG milepost glyph styled after the B&O Railroad's concrete mile markers: rounded-top post, "M" stacked above the entry number, slight weathering gradient, tiny chipped corner.

## Usage

1. Open `milepost.html` in a modern browser, or host the file anywhere.
2. Optionally enter API keys in the **Configuration** panel for the two key-gated sources, and toggle the locomotive whistle if you want sound on capture.
3. Press **NEW ENTRY**.
4. Grant location permission if prompted. The instrument falls back to IP geolocation after 4 seconds if denied or unavailable.
5. The capture log fills in as each source resolves. When capture completes, the calibration stamp drops into place from above, the locomotive whistle plays if enabled, and a small swatch row at the top of the journal area shows the **palette of the day** derived from sun altitude and cloud cover.
6. Write your observation in the **Observation** area below the readings. Optionally adjust the **Mood / Energy / Focus** sliders above the textarea to record an internal-state reading alongside the external one; press **Skip** to leave them unset. Optionally expand **Body / Health Reading** below the textarea to log heart rate, blood pressure, blood oxygen, blood glucose, body temperature, weight, sleep, steps, HRV, and any notes (medications, symptoms, etc.); each field is independently optional and the block stays collapsed by default. Optionally add **Tags** below (comma- or space-separated, with or without `#`) to file the entry under one or more lightweight categories.
7. Save as `.TXT` or `.JSON`, or copy the formatted text to your clipboard. Anything you've written into the observation, tags, or sliders is auto-saved to localStorage as a draft and restored if the page is reloaded mid-entry; the draft clears the moment you save.

### Keyboard shortcuts

`Cmd/Ctrl + Enter` saves the current entry as `.TXT`.
`Cmd/Ctrl + Shift + N` triggers a new capture.

### Session archive

Within a session, completed entries are listed at the bottom of the page. The archive clears on page reload, since persistence is via the file exports.

### Source diagnostic

The companion `milepost-status.html` page probes every data source in parallel and reports green (responding under 3 seconds), yellow (responding but slow), red (failing with the error message shown inline), or grey (skipped because no API key is configured). Useful for verifying the instrument is fully calibrated before relying on it, or for tracking down why a particular section came back unavailable on a recent capture. Cross-links between the three pages (capture, reader, status) appear in each page's header badge.

## API keys (optional)

Two data sources require free API keys. Both are instant signup, no payment, no waiting.

**NASA FIRMS** for wildfire thermal anomaly detection. Request a Map Key at https://firms.modaps.eosdis.nasa.gov/api/map_key/

**eBird** for nearby bird observations. Generate a token at https://ebird.org/api/keygen

Keys are stored in browser localStorage when available, with an in-memory fallback for sandboxed contexts. They never leave your machine except when contacting the respective service during a capture. Without them, those two sources display "add key in settings"; everything else still works.

## Output formats

**Plain text (`.txt`)** is a human-readable field journal page with section rules, aligned columns, and the observation appended after a banner. Filenames are stamped `milepost_YYYYMMDD-HHMM_NNN.txt`.

**JSON (`.json`)** contains the full structured snapshot of every captured signal plus the observation text. Top-level keys are `instrument`, `series`, `version`, and `entry`. The entry's `snapshot` field holds all raw data returned by each source.

## The Reader

`milepost-reader.html` is a companion viewer for the JSON files you have saved. It loads files from your machine and renders them in the same field-instrument aesthetic, with two view modes.

### List view (default)

- A searchable sidebar list of all loaded entries, each marked with its own mini milepost glyph
- A **tag filter strip** below the search box listing every unique tag across the loaded archive with counts, plus an "all" pill. Click a tag to scope the list to entries with that tag; click again or pick "all" to clear. Tags shown on each entry's detail view are themselves clickable jump links into the filter.
- A reading-focused detail panel that puts the observation above the data sections (since by the time you are reading an entry, the observation is what you came back for). Below the observation, entries display their **tags**, the **palette of the day** captured with the entry (four-color swatch row), the **internal-state reading** (Mood / Energy / Focus bars) if the entry had those filled in, and the **body / health reading** (heart rate, blood pressure with clinical category label, blood oxygen, glucose with mmol/L conversion, body temperature in °F and °C, weight in lb and kg, sleep, steps, HRV, and any notes) if any health fields were logged
- A per-entry context map between the metadata blocks and data sections: a small map centered on the capture point with markers for the nearby quakes, fires, stream gauge, tide station, and notable bird sightings the instrument logged. Legend at the foot of the map identifies each marker type.
- An aggregate stats strip across the top: entry count, span in days, distinct locations, total words written, average temperature, total species seen
- Search across observations, locations, weather conditions, cultural picks, news headlines, tags, and filenames
- Arrow-key navigation between entries
- A small "captured on _platform_" line in the entry footer drawn from the `meta.client.platform` field

### Map view

A full-width archive map plots every entry that has coordinates as a milepost glyph dropped on the map. Click any marker to open a popup with the entry's serial, capture time, location, and a brief excerpt of the observation; click "Read entry" in the popup to jump back to the list view with that entry selected. The map view also shows the same detail panel below the map, populated with whatever entry is currently selected. The view meta shows `N of M entries have coordinates` so you can tell at a glance if any entries are missing location data.

Both maps use CartoDB Positron tiles routed through a sepia/desaturation filter to nudge them toward the manila palette of the rest of the instrument. Attribution and controls are restyled to match.

### Loading files

There are three ways to load files into the reader:

1. **Open Folder** uses the File System Access API to read every JSON in a chosen folder at once. Works in Chromium browsers (Chrome, Edge, Brave, Arc).
2. **Open Files** uses the standard file picker. Works everywhere. Select one or many JSON files.
3. **Drag and drop** files or a folder onto the page. Recursive directory drop is supported in most browsers.

The reader loads typography from Google Fonts and the Leaflet map library plus CartoDB tiles from CDN. Entries themselves never leave your machine; there is no upload, no telemetry, no caching beyond the current page session. Clearing the page or hitting the **Clear** button discards the loaded archive without touching any files on disk.

### Per-entry actions

- **View Raw JSON** opens a modal with the full structured payload, useful when you want to verify exactly what was captured
- **Print** uses a stylesheet that hides the sidebar, map controls, and chrome, leaving a clean single-page render of the entry suitable for paper
- **Clear** wipes the loaded archive from memory without touching disk

## Privacy

All data stays on your machine. There is no server. Capture requests go directly from your browser to each data source's public API. API keys live in your browser's localStorage. The instrument carries no analytics, no telemetry, no tracking. Saved files are plain files on your disk.

## Browser requirements

A modern browser supporting ES2020, Fetch, and CSS Grid. Tested on recent Chrome, Firefox, and Safari. Google Fonts are loaded from CDN; system font fallbacks engage when offline. The page works fully without internet for everything except the actual data fetches.

## Series

This is the third instrument in the Field Instrument series at Green Shoe Garage. The instrument carries its proper name (MILEPOST) alongside its series designation (Field Instrument 003) in all output and metadata, the way a vessel carries both a name and a hull number.

## Data sources

All sources are free and publicly accessible. No third-party servers proxy any request.

| Domain | Source |
| --- | --- |
| Weather, air quality, pollen, geocoding | Open-Meteo |
| Atmospheric CO₂ (weekly Mauna Loa) | NOAA Global Monitoring Laboratory |
| Sunrise, sunset, civil & astronomical twilight | sunrise-sunset.org |
| Solar disk image | NASA Solar Dynamics Observatory |
| Meteor showers, eclipses through 2030 | client-side tables (IMO, NASA Five Millennium Catalog) |
| ISS position | WhereTheISS.at |
| Space weather (Kp, solar wind) | NOAA SWPC |
| Aurora visibility forecast | NOAA SWPC OVATION |
| Seismic activity | USGS Earthquake Hazards Program |
| Wildfire detection | NASA FIRMS (VIIRS_SNPP_NRT) |
| Streamflow | USGS Water Services (NWIS) |
| Tide levels | NOAA Tides and Currents (CO-OPS) |
| Bird observations | eBird |
| Cryptocurrency prices | CoinGecko |
| Crypto sentiment (Fear & Greed Index) | alternative.me |
| Currency exchange rates | Frankfurter |
| Stock indices, treasury yields, commodities | Yahoo Finance (unofficial chart endpoint) |
| Cultural charts | Apple Marketing Tools RSS |
| US box office number-one film | Wikipedia (MediaWiki Action API) |
| Wikipedia featured & on this day | Wikipedia REST API |
| Tech discourse | Hacker News Firebase API |
| Popular discourse | Reddit JSON endpoints |
| Astronomy picture of the day | NASA APOD |
| Webcomic | xkcd JSON API |
| Recent scientific paper | arXiv API |
| Trending code repository | GitHub Search API |
| IP geolocation fallback | ipapi.co |

## Files

- `milepost.html` is the capture instrument. Open it to take a new entry.
- `milepost-reader.html` is the companion archive viewer. Open it to browse, search, and read the JSON entries you have saved.
- `milepost-status.html` is the source diagnostic. Open it to probe every data source MILEPOST uses and verify the instrument is fully calibrated without needing to make a capture.
- `README.md` is this document.

## Roadmap notes

Possible future additions: retroactive instrument names for Field Instruments 001 and 002, optional archive persistence (export the whole session as a bundle), small visual touches like miniature milepost glyphs in the session archive, and the remaining items from the v0.0.6 brainstorm session that were deferred for CORS or complexity reasons: US Drought Monitor, USGS volcanic alerts, SNOTEL snow water equivalent, PurpleAir air quality, Word of the Day, Poem of the Day, ProductHunt.

## Acknowledgements

Typography: JetBrains Mono and Newsreader (both via Google Fonts).

Astronomical algorithms after Jean Meeus, "Astronomical Algorithms."

Mapping: Leaflet (BSD-2-Clause) over CartoDB Positron tiles (CC BY 3.0) and OpenStreetMap data (ODbL).

## Philosophy

Milepost captures a snapshot in time, not a feed. Each entry is a frozen moment with whatever external context was visible from the network at the moment of capture. This frames how data sources are chosen: instead of pursuing stable APIs with version guarantees and rate-limit contracts, the instrument prefers **scraping** in the literal newspaper sense, ripping the page out, taking what is there, accepting that it will not be there forever. Brittleness is acceptable because once an entry is written to disk, the data is preserved. If Wikipedia restructures next year, or Apple deprecates a feed, or Yahoo locks down CORS, today's captured entry still has today's data, frozen on the page. The captures themselves become a record of what was even available to know.

This is why **Wikipedia** is the press wire of the instrument: encyclopedic, daily-updated for popular topics, CORS-friendly via `origin=*`, and structured enough to parse without auth. Wikipedia covers Box Office #1, Billboard Hot 100 #1, Billboard 200 #1, current events, recent deaths, and dozens of other "what is true today" questions. Scrapers prefer Wikipedia first, then specific sources second (Apple Marketing Tools, NOAA, etc.), then nothing if neither responds. The status page tells you which is reachable from your environment.

## Changelog

**v0.0.9** today's news (Wikipedia Current Events Portal). The biggest single news source the instrument has access to is the page Wikipedia editors maintain daily for current events, located at `Portal:Current_events/YYYY_Month_DD`. Each day's page is structured wikitext: bolded category headings (`;Armed conflicts and attacks`, `;Disasters and accidents`, `;Politics and elections`, `;Sports`, etc.) with bulleted top-level items underneath (`*[[wiki-link]] description...`). The new `getCurrentEvents()` fetcher pulls today's page via the MediaWiki action=parse API, walks the wikitext line by line, and extracts the first top-level item from each category section as a single-line headline. Wiki-link decorations, templates, and external-link markup are stripped to leave plain prose. If today's page does not yet exist (editors typically seed it overnight UTC), the fetcher falls back to yesterday's page. Headlines are persisted under `data.discourse.currentEvents` with the source date and the canonical Wikipedia URL. The text export gains a "Today's News" block under DISCOURSE listing each category and its headline. The reader gains a corresponding sub-list inside the Discourse section, with a left-bordered list of category-text rows. The status page gains a "Wikipedia Current Events" probe that reports how many category sections were found for today, alongside the existing Wikipedia Featured probe. This is also the change that prompted the philosophy section above: Wikipedia Current Events is the cleanest demonstration of "ripping the page out of today's newspaper" the instrument has shipped, and articulates the scraping-first orientation that will shape future data-source choices.

**v0.0.8.2** cultural pulse fallback, reader data-presence banner, comprehensive sample JSON. Two follow-up improvements after the v0.0.8.1 patch. **Cultural Pulse** previously surfaced only the movie when Apple's RSS endpoints were unreachable from the user's environment (a separate issue from Yahoo's CORS situation; Apple's marketing tools host can be blocked at the network or browser level for various reasons). The patch adds Wikipedia fallbacks for the two chart types where Wikipedia maintains weekly #1 lists: Songs (via "List of Billboard Hot 100 number ones of YEAR") and Albums (via "List of Billboard 200 number ones of YEAR"). Apple stays primary for richer metadata (genres, artwork URLs, release dates); Wikipedia fills in only when Apple returns nothing. The other Apple-only fields (apps, podcasts, books) have no equivalent CORS-friendly fallback and simply omit when Apple is unreachable, with `[Milepost] cultural/X:` diagnostics logged for each failure. **The reader gained a data-presence banner** that appears below the entry header listing which user-input sections (Tags, Palette, Mood, Body) were captured with the entry. Sections present are shown as solid orange pills with a checkmark; sections absent are dashed-outline grey pills with a cross. This makes it immediately obvious whether the data is missing from the entry (user didn't fill it in during capture) or whether the renderer is failing (banner shows pills as present but corresponding section doesn't appear below). Banner only renders when at least one user-input section was filled. **A comprehensive reference JSON** (`sample-milepost_v008-comprehensive.json`) ships alongside the other files, populated with every field the schema supports including a realistic body reading, mood sliders, four tags, a palette, full markets data (Yahoo-style), and richer-than-typical cultural and discourse blocks. Loading it into the reader and confirming all sections render serves as a ground-truth verification that the rendering paths are wired correctly, distinguishing rendering bugs from "user never filled in this field" cases.

**v0.0.8.1** bug fixes for movie parser and stock-market fetcher. Two long-standing issues surfaced after watching real captures. **The Wikipedia movie parser was pulling truncated and incorrect data**, displaying entries like "Top Movie / Star Trek / $75" instead of the actual #1 film. The cause was twofold: the film-name extraction grabbed the LAST italic-wrapped wiki-link in the entire article, which sometimes matched a film reference inside a "Notes" column ("broke Star Trek's record (...)") rather than the real Film cell; and the gross regex `\$([0-9](?:[0-9,]*[0-9])?)` did not include decimals or require comma groups, so a notes mention like "$75.4 million" was captured as just "$75". Fix: replaced the parser with a row-based walk that splits the wikitext on `|-` row delimiters, then scans each row's cells in order to find the FILM cell (first italic link) followed by the GROSS cell (first dollar amount with comma groups). The gross regex `\$(\d{1,3}(?:,\d{3})+)(?!\d|\.\d)` now requires at least one comma group, which filters out all the "$X million" / "$X.X million" shorthand references that appear in notes. A loose-scan fallback remains for the case where the article structure ever changes. **The Markets section was empty because Yahoo Finance disabled CORS for browser-origin requests as part of their February 2025 redesign**, which silently broke all stock, treasury, and commodity fetchers. The fix adds Stooq as a fallback: `getStockIndex(symbol)` now tries Yahoo first (richer schema with true previous close) and on any failure falls back to Stooq's free CSV endpoint at `stooq.com/q/l/`, which is CORS-enabled. Yahoo's symbols map to Stooq's lowercase indices (`^GSPC` → `^spx`, `^DJI` → `^dji`, `^IXIC` → `^ndq`, `^VIX` → `^vix`, `^TNX` → `^tnx`, etc.) and dot-f futures notation (`GC=F` → `gc.f`, `CL=F` → `cl.f`, `SI=F` → `si.f`). Stooq's lite endpoint gives OHLCV for the current trading day but no separate previous close, so the day's change is computed as (close - open), which is the intraday change rather than vs-previous-close, but still gives the directional signal. Both sources tag their data with a `source: "yahoo" | "stooq"` field on the saved snapshot so you can tell which one was used. Diagnostic console messages (`[Milepost] markets/yahoo` and `markets/stooq`) make failures visible. The self-status page gained a separate Stooq probe row alongside the Yahoo one so you can see which sources are reachable from your environment.

**v0.0.8** body / health reading. The capture instrument gained an optional Body / Health block that appears below the observation textarea as a collapsed `<details>` element, expandable on demand. Inside is a three-column grid of numeric inputs covering Heart Rate (bpm), Blood Pressure (systolic / diastolic mmHg), Blood Oxygen / SpO2 (%), Blood Glucose (mg/dL), Body Temperature (°F), Weight (lb), Sleep last night (hr), Steps today (count), and HRV (ms), plus a free-form Notes textarea for medications, symptoms, exercise, or anything else worth recording. Every field is independently optional; entering anything anywhere flips the block's outline from dashed grey to solid orange and shows a "_N_ fields set" counter so you can confirm at a glance whether body data is attached. A Clear All button resets every field. Values are persisted on the saved JSON snapshot under `data.body` with implicit-unit field names (`heartRate`, `bloodPressure.systolic`, `bloodOxygen`, `bloodGlucose`, `bodyTemperatureF`, `weightLb`, `sleepHours`, `steps`, `hrv`, `notes`). The text export gains a BODY / HEALTH block that displays each entered field with parenthetical unit conversions where they vary by region (glucose in mg/dL + mmol/L, temperature in °F + °C, weight in lb + kg). The reader gains a new Body / Health section in the entry detail view, rendered with the same kv-row style as the data sections, with clinical category qualifiers attached to relevant fields (normal / elevated / stage 1 HTN / hypoxia / fever / etc.) so you can read an old entry and immediately see whether a value was concerning. Notes appear as a bordered prose block with a flag-orange accent. Body data also flows through the draft auto-save, so partially-entered health readings survive page reloads. Older entries without `data.body` continue to load cleanly and simply omit the section.

**v0.0.7** ritual and reflection. The instrument gained nine features focused on capture experience, self-reflection, and meta-tooling rather than new data sources. **Stamp animation** drops the "CALIBRATED / IN SERVICE" stamp from above the page on capture completion, rotating into place with an overshoot easing. **Locomotive whistle** plays optionally on capture using the Web Audio API to synthesize a three-tone G minor steam-whistle chord with vibrato and a faint delayed echo. Off by default; toggle lives in the Configuration panel alongside the API key inputs. **Palette of the day** computes four hex colors (sky, horizon, cloud, accent) from cloud cover and sun altitude, renders as a swatch row at the top of the journal area, and persists in the entry snapshot. **Capture method tag** detects platform from user agent and persists it as `meta.client.platform` (iphone, ipad, android-phone, android-tablet, mobile, desktop) along with viewport size and language. **Self-status page** (`milepost-status.html`) is a new standalone diagnostic that probes every data source in parallel and reports green / yellow (slow over 3s) / red / grey (skipped because no key configured) for each, with summary counts at the top. **Mood / Energy / Focus sliders** capture an internal-state reading (1-10 each) alongside the external-state readings, with a Skip button so they remain optional. Slider values only count when actively set. **Cross-links** appear in the badge area of each page pointing to the others (capture, reader, status). **Tags** are free-form text input below the observation, parsed from comma- or space-separated tokens, displayed as live chips, persisted in the snapshot. The reader gained a tag-filter strip below the search box that lists all unique tags with counts and lets you click to filter; tags on each entry also become clickable jump links to that filter. **Draft auto-save** persists observation text, tags, and slider values to localStorage with a 400ms debounce; on page load, any non-empty draft is restored and a "Draft restored" flash confirms it. Saving an entry clears the draft. Text export gained INTERNAL STATE, PALETTE OF THE DAY, META, and Tags blocks. Reader version bumped to v0.0.7 alongside.

**v0.0.6** broad signal expansion. The instrument now captures eleven additional data points across five sections. **Atmospheric** gained dewpoint and current UV index from Open-Meteo (in addition to the existing daily peak), plus the latest weekly atmospheric CO₂ reading from the NOAA Global Monitoring Laboratory's Mauna Loa observatory with year-over-year change. **Celestial** gained civil and astronomical twilight times via sunrise-sunset.org, a URL pointer to the current NASA SDO solar disk image (HMI Intensitygram), currently-active meteor showers from a client-side table flagging peak days, and the next eclipse with countdown drawn from a static NASA Five Millennium Catalog excerpt running through 2030. **Space Weather** gained an aurora visibility probability for the user's coordinates from NOAA SWPC's OVATION 30-minute forecast. **Markets** gained 5-year, 10-year, and 30-year US Treasury yields with the 10y-5y spread flagged inverted or normal, gold, silver, and WTI crude oil futures, and the Crypto Fear & Greed Index from alternative.me. **Curio** grew from two cards (APOD, xkcd) to four with the most recent arXiv submission in cs.AI / cs.CL / astro-ph.SR / physics.hist-ph and the most-starred new GitHub repository from the past seven days. The capture-log SOURCES list grew a new "Climate / CO₂" row. All new fetchers follow the established try/catch pattern: failures log a tagged warning to the console and the section renders without the missing row. The reader was bumped to v0.0.6 alongside the capture instrument to reflect the substantial schema additions; older entries without the new fields still load cleanly and simply omit the new rows.

**v0.0.5** restored Top Movie to the Cultural Pulse section using Wikipedia as the source. Apple's iTunes Movies feed is permanently gone, so the new fetcher pulls the article "List of YYYY box office number-one films in the United States" via the MediaWiki Action API (CORS-enabled with `origin=*`), scans the weekly box-office table for the last italic-wrapped film link, and captures both the title and the most recent weekend gross. The article is updated by Wikipedia editors every Monday after the weekend numbers settle, so the data is current to within a week. The renderer shows the gross as a secondary value on the Top Movie row (e.g. "Michael / $97,206,874"). Source attribution in the section header is now dynamic, so it reads "Apple Charts, Wikipedia" or just one of those depending on which providers actually returned data.

**v0.0.4** fixed the Cultural Pulse section, which had been silently returning "unavailable" because of two issues: Apple deprecated the iTunes Top Movies feed entirely, and the old `rss.applemarketingtools.com` host now 301-redirects to `rss.marketingtools.apple.com`, which browser CORS preflight refuses to follow for cross-origin requests. The fetchers now use the canonical host directly, the dead Movies row is replaced with Top App (a livelier cultural-zeitgeist signal than iTunes movie rentals were anyway), missing rows are no longer rendered as "--", and any future fetch failure logs a specific reason to the browser console. The schema field `cultural.movie` is preserved on read so legacy entries still render their movie row.

**v0.0.3** added stock market indices (Dow Jones, S&P 500, NASDAQ Composite, VIX) via Yahoo Finance's unofficial chart endpoint. Each carries current price, previous close, day change in points and percent, day high and low, and market state. The endpoint is undocumented and could change without notice; if Yahoo tightens access, that row simply shows unavailable while everything else still captures.

**v0.0.2** added coordinate persistence for NOAA tide stations and notable eBird observations so the reader can plot them on the per-entry context map. Existing v0.0.1 entries still load; they simply lack those map markers. The viewer's full feature set was introduced in this version (per-entry context map, archive overview map with view switcher).

**v0.0.1** initial release. Capture instrument with fifteen data sources, JSON and TXT export, reader companion with list view.

## License

GPL-3.0
