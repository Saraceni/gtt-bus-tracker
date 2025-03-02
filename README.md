# Torino Bus Tracker

A real-time interactive map application that displays the current locations of public transportation vehicles throughout Torino. This project provides residents and visitors with up-to-date information on bus movements across the city's transit network.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Data Source

This project uses the official GTFS Real-Time feed provided by GTT through the City of Torino's open data portal:

- Feed: [GTFSRT posizione mezzi GTT](http://aperto.comune.torino.it/dataset/feed-gtfs-real-time-trasporti-gtt/resource/65084c1e-cfca-4232-9509-d949f6a70d33)
- Direct URL: [http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx](http://percorsieorari.gtt.to.it/das_gtfsrt/vehicle_position.aspx)
- License: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
