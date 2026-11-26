# Restful-booker-assets

The assets API is responsible for serving the UI assets to a browser to give users easy access to the restful-booker-platform.

## Building and running

To run the assets service first run ```npm install``` before running ```npm run dev``` to start up the service in development mode. Please note the UI will fail if dependent APIs aren't running.

## Running checks

Run ```npm test``` to run the unit checks for this service.

## API routing

The UI uses `/ui-api/...` for its Next.js handlers. The separate `/api/{service}/...`
route proxies the underlying API without applying the UI handlers' response transformations.
For example, the room Swagger UI is available at `/api/room/swagger-ui/index.html`.
The other services are `booking`, `branding`, `auth`, `report`, and `message`.

The proxy reads `ROOM_API`, `BOOKING_API`, `BRANDING_API`, `AUTH_API`, `REPORT_API`,
and `MESSAGE_API` at runtime. These are service origin URLs (for example,
`http://rbp-room:3001`); local development defaults to localhost. The services'
production profiles configure Swagger to use the public `/api/...` paths. Their
development profiles retain direct service URLs for local API development.

## Container port

The Assets container listens on port 3003 by default as a non-root user. Docker
Compose maps host port 80 to container port 3003. Hosting platforms such as
Railway can override the default with the `PORT` environment variable; configure
the platform's target port to match.
