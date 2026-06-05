# PSD Project

Static multi-page site assembled from PSD assets.

## Structure

- `index.html`, `about.html`, `catalog.html`, `download.html`, `request.html` page templates
- `css/common.css` shared stylesheet base
- `css/home.css` homepage stylesheet entry
- `css/about.css` about page stylesheet entry
- `css/catalog.css` catalog page stylesheet entry
- `css/download.css` download page stylesheet entry
- `css/request.css` request page stylesheet entry
- `assets/` exported images and icons used by the site
- `deliverables/homepage/` standalone homepage package for sending
- `deliverables/homepage.zip` packaged homepage archive

## Development

- `npm run start` starts the local static server at `http://127.0.0.1:4173`

## Sending The Homepage

- Send `deliverables/homepage.zip` when only the homepage is needed
- `deliverables/homepage/` contains the unpacked standalone homepage version
- The standalone homepage keeps local assets and anchor links so it can be opened separately
