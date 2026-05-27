# MILEPOST

**Field Instrument 003** / Environmental Capture & Journal

A single-file web instrument that takes an environmental fix of the world at the moment of an entry and binds that snapshot to a written observation. Each entry becomes a milepost: a fixed marker along the route you are walking through time.

Version 0.0.1 / Green Shoe Garage / Mountain Maryland

---

## What it captures

When you press **NEW ENTRY**, the instrument queries fifteen distinct sources to assemble a snapshot, running them concurrently after first establishing your location. Each source captures independently and fails gracefully. The capture log shows live status (pending, working, captured, unavailable, key required) for every source.

**Location** via browser geolocation, with IP-based fallback after a 4-second timeout.

**Atmospheric** conditions, temperature, apparent temperature, humidity, pressure, wind (speed, direction, gusts), cloud cover, precipitation, visibility, UV index peak, US AQI, and pollen counts for six taxa where regionally available (Open-Meteo).

**Celestial** sun sign, sun altitude and azimuth, moon phase with illumination percentage and lunar age, sunrise, sunset, day length, Julian day, and days until the next equinox or solstice (Meeus astronomical algorithms, computed locally).

**Space Weather and Orbital** Kp index with geomagnetic activity classification, solar wind speed, plasma density and temperature, ISS lat/lon/altitude/velocity (NOAA SWPC, WhereTheISS.at).

**Telluric** nearest seismic event within 500km with magnitude, place, depth, and time since; count of nearby M1.5+ events; largest M4+ event globally in the last 24 hours; wildfire thermal anomalies within 500km with distance and fire radiative power (USGS Earthquake Hazards Program, NASA FIRMS).

**Hydrosphere** nearest active USGS stream gauge with discharge in cubic feet per second and gauge height in feet; nearest NOAA tide station with water level relative to MLLW, or "inland" status with distance to the closest coastal station (USGS NWIS, NOAA CO-OPS).

**Biosphere** bird species diversity within 50km over the past 3 days, up to three notable or rare sightings from the past 7 days with locations and counts, and the latest observation (eBird).

**Markets** BTC, ETH, and XMR vs USD with 24-hour change; USD exchange rates for EUR, GBP, JPY, and CAD (CoinGecko, Frankfurter).

**Cultural Pulse** top song, album, movie, podcast, and book from Apple's charts (Apple Marketing Tools RSS).

**Discourse** the most-read Wikipedia article today with view count and description, Wikipedia's "In the News" headline, the top Hacker News story with score and comment count, and the top r/popular post with subreddit and score (Wikipedia REST API, HN Firebase, Reddit JSON).

**Curio** NASA Astronomy Picture of the Day with title and excerpt, and the latest xkcd with title and alt text (NASA APOD, xkcd JSON).

**On This Day** three historical events from this calendar date, drawn from across the centuries (Wikipedia).

Each captured entry is labeled with a small SVG milepost glyph styled after the B&O Railroad's concrete mile markers: rounded-top post, "M" stacked above the entry number, slight weathering gradient, tiny chipped corner.

## Usage

1. Open `milepost.html` in a modern browser, or host the file anywhere.
2. Optionally enter API keys in the **Configuration** panel for the two key-gated sources.
3. Press **NEW ENTRY**.
4. Grant location permission if prompted. The instrument falls back to IP geolocation after 4 seconds if denied or unavailable.
5. The capture log fills in as each source resolves.
6. Write your observation in the **Observation** area below the readings.
7. Save as `.TXT` or `.JSON`, or copy the formatted text to your clipboard.

### Keyboard shortcuts

`Cmd/Ctrl + Enter` saves the current entry as `.TXT`.
`Cmd/Ctrl + Shift + N` triggers a new capture.

### Session archive

Within a session, completed entries are listed at the bottom of the page. The archive clears on page reload, since persistence is via the file exports.

## API keys (optional)

Two of the fifteen data sources require free API keys. Both are instant signup, no payment, no waiting.

**NASA FIRMS** for wildfire thermal anomaly detection. Request a Map Key at https://firms.modaps.eosdis.nasa.gov/api/map_key/

**eBird** for nearby bird observations. Generate a token at https://ebird.org/api/keygen

Keys are stored in browser localStorage when available, with an in-memory fallback for sandboxed contexts. They never leave your machine except when contacting the respective service during a capture. Without them, those two sources display "add key in settings"; everything else still works.

## Output formats

**Plain text (`.txt`)** is a human-readable field journal page with section rules, aligned columns, and the observation appended after a banner. Filenames are stamped `milepost_YYYYMMDD-HHMM_NNN.txt`.

**JSON (`.json`)** contains the full structured snapshot of every captured signal plus the observation text. Top-level keys are `instrument`, `series`, `version`, and `entry`. The entry's `snapshot` field holds all raw data returned by each source.

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
| ISS position | WhereTheISS.at |
| Space weather (Kp, solar wind) | NOAA SWPC |
| Seismic activity | USGS Earthquake Hazards Program |
| Wildfire detection | NASA FIRMS (VIIRS_SNPP_NRT) |
| Streamflow | USGS Water Services (NWIS) |
| Tide levels | NOAA Tides and Currents (CO-OPS) |
| Bird observations | eBird |
| Cryptocurrency prices | CoinGecko |
| Currency exchange rates | Frankfurter |
| Cultural charts | Apple Marketing Tools RSS |
| Wikipedia featured & on this day | Wikipedia REST API |
| Tech discourse | Hacker News Firebase API |
| Popular discourse | Reddit JSON endpoints |
| Astronomy picture of the day | NASA APOD |
| Webcomic | xkcd JSON API |
| IP geolocation fallback | ipapi.co |

## Files

- `milepost.html` is the entire instrument. Single self-contained file.
- `README.md` is this document.

## Roadmap notes

This is v0.0.1. Likely future additions include retroactive instrument names for Field Instruments 001 and 002, optional archive persistence (export the whole session as a bundle), and small visual touches like miniature milepost glyphs in the session archive.

## Acknowledgements

Typography: JetBrains Mono and Newsreader (both via Google Fonts).

Astronomical algorithms after Jean Meeus, "Astronomical Algorithms."

## License

GPL-3.0
