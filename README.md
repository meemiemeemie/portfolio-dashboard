# Portfolio Dashboard

A modern dashboard for managing multiple Dashlane teams (Portfolio View).
Features a slick glassmorphism design, CSV export, and persistent configuration.

## 🚀 Features

*   **Multi-Tenant Support**: Add multiple (Brand Name, API Token) pairs.
*   **Portfolio Overview**: Aggregated stats (Total Seats, Avg Health Score).
*   **Team Drill-Down**: Detailed view for each organization.
*   **CSV Export**: Flattened data export for all users.
*   **Persistent Config**: Tokens are saved locally in your browser.

## 📦 Deployment Guide (For Admins)

To provide this tool to non-technical admins without requiring them to use the terminal, we recommend **hosting the application**.

### Option 1: Vercel (Recommended)
1.  Fork or push this repository to your GitHub/GitLab.
2.  Log in to [Vercel](https://vercel.com).
3.  Click "Add New Project" and select this repository.
4.  Vercel will detect Create React App.
5.  Click **Deploy**.
6.  **Done!** Share the production URL with your admins.
    *   *Note: `vercel.json` is included to handle routing.*

### Option 2: Netlify
1.  Fork or push this repository to your GitHub/GitLab.
2.  Log in to [Netlify](https://www.netlify.com/) and click "Add new site" > "Import an existing project".
3.  Connect to your repository provider and select this project.
4.  Netlify will automatically detect the build settings (`npm run build` and `build` directory).
5.  Click **Deploy site**.
6.  *Note: The included `public/_redirects` file handles routing and API proxying automatically.*

### Option 3: Render
1.  Fork or push this repository to your GitHub/GitLab.
2.  Log in to [Render](https://render.com/) and create a new **Static Site**.
3.  Connect your repository.
4.  Set the Build Command to `npm run build` and the Publish directory to `build`.
5.  Click **Create Static Site**.
6.  **Important**: Render Static Sites do not automatically read proxy configuration files. You must manually add a Rewrite rule in the Render Dashboard so the Dashboard can communicate with the Dashlane API:
    *   Go to **Redirects/Rewrites** in your Render site settings.
    *   Add rule -> **Source**: `/api/*`, **Destination**: `https://api.dashlane.com/public/teams/*`, **Action**: `Rewrite`.
    *   Add rule -> **Source**: `/*`, **Destination**: `/index.html`, **Action**: `Rewrite` (to handle React routing).

### Option 4: Local Usage (Technical)
1.  Install Node.js.
2.  Run `npm install`.
3.  Run `npm start`.

## 🛠 Tech Stack
*   React
*   Tailwind CSS (Custom Dark Theme)
*   Recharts
*   Axios
