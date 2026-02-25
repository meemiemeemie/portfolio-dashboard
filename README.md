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

### Option 4: Local Usage (For Admins starting from scratch)
If you want to run this on your own computer but don't have a developer setup, follow these steps:

1.  **Download Node.js**:
    *   Go to [https://nodejs.org/](https://nodejs.org/) and download the "LTS" (Long Term Support) version for your operating system (Windows or macOS).
    *   Run the installer and follow the default prompts. This installs both `node` and `npm` (Node Package Manager).
2.  **Download this Project**:
    *   On this repository page, click the green **Code** button and select **Download ZIP**.
    *   Extract the ZIP file to a folder on your computer (e.g., your Desktop).
3.  **Open your Terminal/Command Prompt**:
    *   **Mac**: Press `Cmd + Space`, type `Terminal`, and hit Enter.
    *   **Windows**: Press the Windows key, type `cmd`, and hit Enter to open Command Prompt.
4.  **Navigate to the Project Folder**:
    *   In the terminal, type `cd ` (cd followed by a space).
    *   Drag and drop the extracted folder from your Desktop into the terminal window, then hit Enter.
5.  **Install Dependencies**:
    *   Type `npm install` and hit Enter. Wait for it to finish (this downloads the required libraries).
6.  **Start the Dashboard**:
    *   Type `npm start` and hit Enter.
    *   The dashboard will automatically open in your default web browser at `http://localhost:3000`.

## 🛠 Tech Stack
*   React
*   Tailwind CSS (Custom Dark Theme)
*   Recharts
*   Axios
