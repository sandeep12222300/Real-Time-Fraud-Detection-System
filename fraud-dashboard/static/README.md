Static Fraud Dashboard

This folder contains a static HTML/CSS/JS version of the React dashboard for quick local demos.

Files:
- index.html - main page
- styles.css - styles adapted from the React CSS module
- api.js - API wrapper that implements same fallback logic as the React app
- charts.js - lightweight SVG chart renderers (bar + line)
- app.js - app logic: polling, rendering KPIs, table, charts
- mock-data.json - local demo data used when the backend API is not reachable

How to run locally (examples):

Using Python 3 built-in server (from repository root):

```powershell
cd "D:\JetBrainsProjects\Projects\Real Time Fraud Detection"
python -m http.server 8080
```

Then open in your browser:

http://localhost:8080/fraud-dashboard/static/index.html

Notes:
- The static app tries to fetch from the same API endpoints as the React app. If the backend is unavailable, it falls back to `mock-data.json` to allow offline demo.
- To test large tables, use the query parameter: `?debugTable=1` to generate many rows.
- This is a minimal static port meant to preserve the look and polling behavior. It avoids external dependencies and large chart libraries.

If you want me to integrate this into the build output (`fraud-dashboard/build`) or replace the React source, tell me which option to choose.
