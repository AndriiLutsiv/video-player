The application consists of 2 parts: client and server. Client is a react-built application and server is express-built.
To setup the whole project locally please perform "Setup"
## Setup

To set up and run the client, follow these steps:
1. Open first terminal and from the project root folder navigate yourself to /client

2. Install dependencies for the client:
```bash
npm install
```

4. Build the TypeScript source code:
```bash
npm run build
```

5. Start the client:
```bash
npm start
```

6. Open second terminal and from the project root folder navigate yourself to /server

7. Install dependencies for the server:
```bash
npm install
```

8. Build the TypeScript source code:
```bash
npm run build
```

9. Start the server:
```bash
npm run serve
```
10. Refresh browser page if needed

## Docker
Run `docker-compose up --build` inside the main project directory
To start interacting with the application, open http://localhost:3050/ in a browser.


## For production
For production need to navigate to docker-compose.yml in the root project directory and replace 
REACT_APP_SERVER_URL=http://localhost:3050
to
REACT_APP_SERVER_URL=http://<your_domain_name>/api

