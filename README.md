# Web Clipboard

A simple web clipboard for sharing text and images between devices. Sign in with Google, paste or type content, and access it from anywhere.

Live at [clipboard.waltersmuts.com](https://clipboard.waltersmuts.com)

## Features

- Google OAuth sign-in
- Text clipboard with auto-save
- Image upload and paste support
- Copy to local clipboard

## Stack

- **Frontend:** Vanilla HTML/CSS/JS
- **Backend:** Python Flask with Waitress
- **Auth:** Google Sign-In
- **Storage:** Flat files on disk (`/var/clipboard/`)

## Deploy

```
sudo make deploy
sudo systemctl restart clipboardbackend
```

## Project Structure

```
index.html              Frontend
styles.css              Styles
clipboard.js            Client-side logic
clipboardbackend.py     Flask backend
clipboardbackend.service  Systemd unit file
Makefile                Deployment
```
