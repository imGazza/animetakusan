# Anime Takusan

A platform to browse, track and cross-sync watched anime on AniList and MyAnimeList.

## Features

- Browse every anime from current season, upcoming season, free search and filter, powered by AniList APIs.
- Detailed anime pages with related titles, recommendations, reviews and rankings.
- Full public browsing without an account.
- Sign-in possible through a local account or Google.
- Link an AniList account and a MyAnimeList account to a single profile.
- Manage a personal library: set watching status, progress, score and start/finish dates, mark favourites, and remove entries, with synchronous updates on AniList.
- Automatic asynchronous updates to MyAnimeList, by a RabbitMq queue and a dedicated service.
- Clean user interface.
- Light and dark themes, with a layout that adapts to mobile.

## Technologies

**Backend** — .NET 10, Entity Framework Core, PostgreSQL, Redis, RabbitMQ, GraphQL (StrawberryShake), Serilog with Seq.

**Frontend** — React, Vite, Shadcn, TanStack Query, React Router, Tailwind CSS.

**Integrations** — AniList, MyAnimeList, Google OAuth.

**Infrastructure** — Docker for services containers. Self-hosted on a (poor) Raspberry Pi 3B using Nginx and a Cloudflare tunnel. Frontend hosted on Vercel. Deployed using Github Actions.
