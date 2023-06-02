# Node Server

This is a Node.js server with Express, using TypeScript and connected to a PostgreSQL database. It has three main features, which are exposed through the following API endpoints:

## Features

### 1. Share Endpoint

Endpoint: `/share/:uuid`

This endpoint accepts a GET request with a UUID as a parameter. It fetches the database record from the PostgreSQL database using a filter query based on the UUID column. After retrieving the record, it uses the company ID to query another table named `client_info` to get the logo URL. The endpoint then returns a JSON object with all the obtained information.

### 2. Play Endpoint

Endpoint: `/play/:uuid`

This endpoint updates the database record using the provided UUID. It changes the `played` column from `false` to `true` for the specified record and returns a response confirming the update.

### 3. CTA Endpoint

Endpoint: `/cta/:uuid`

This endpoint updates the database record using the provided UUID. It changes the `cta_clicked` column from `false` to `true` for the specified record.

## Setup

To set up and run the server, follow these steps:

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript source code:
```bash
npm run build
```

3. Start the server:
```bash
npm run serve
```
