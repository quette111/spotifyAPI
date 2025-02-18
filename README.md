# Spotify New Releases and Playlists App

This web application allows users to explore the latest music releases and browse playlists from Spotify. It uses Spotify's Web API to fetch **new releases** and **playlists** from the public Spotify catalog.

## API Key Usage

In this project, I use the Spotify API to fetch new releases and top tracks. The API key (client ID) is embedded in the frontend JavaScript to demonstrate how to make API requests.

However, **this is not a secure implementation** for production purposes because the API keys are exposed in the frontend. If this project were to be deployed for production, I would move the API request to a backend server (e.g., Node.js) and securely store the API keys using **environment variables**.

### Important:

- This is an educational project and meant to demonstrate working with APIs on the frontend.
- For real applications, API keys should never be exposed in frontend code. Instead, you should use a **backend** to handle API calls and securely store API keys.

## Features
- Browse **new music releases** based on your selected genre.
- Browse **Spotify playlists** by genre.
- View details of tracks in the playlists (album art, track name, artist).

### End-users:
- You can explore **public data** such as new releases and playlists without needing a Spotify account or logging in. Just browse the app!

### Developers:
- If you're deploying or running the app yourself, you will need to set up **Spotify Developer credentials** (Client ID and Client Secret).

---

## Requirements

- **Spotify Developer Account**: In order to use this app, you need a Spotify Developer account to get your **Client ID** and **Client Secret** for accessing the Spotify Web API.  
  [Sign up for a Spotify Developer account here](https://developer.spotify.com/dashboard/applications).
  
- **Web Browser**: This app is a front-end JavaScript application, so you just need a modern web browser to use it.

---

## How It Works

This app leverages **Spotify's Web API** to fetch the following data:
1. **New Releases**: Get the latest music releases from various genres.
2. **Playlists**: Retrieve public playlists based on selected genres.

The app uses **Client Credentials Flow** to authenticate the app itself with Spotify's servers. It does not require end-users to log in to Spotify to browse the data.

### Public Spotify Data:
- The app fetches publicly available data such as **new releases** and **public playlists**. End-users **do not need to sign in** to view the information displayed on the app.

---
---

### Key Points in This README:

1. **End-users** can use the app without any login or credentials — they can view the data displayed (new releases and playlists).
2. **Developers** must obtain their own **Spotify Developer credentials** (Client ID and Client Secret) to run the app.
3. The **Client Credentials Flow** is used to access public data, so there is no need for user login.