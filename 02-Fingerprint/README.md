# Auth0 + Fingerprint Express Sample App

This sample app shows how to integrate Fingerprint visitor identification into an Auth0 authentication flow in an Express Node.js app. It is based on [Auth0's Express OpenID Connect Webapp Sample](https://github.com/auth0-samples/auth0-express-webapp-sample/tree/master/01-Login)

See their full [walk-through](https://auth0.com/docs/quickstart/webapp/express) to get started with the base sample.

## Running This Sample Locally

1. Install the dependencies with npm:

```bash
npm install
```

2. Rename `.env.example` to `.env` and replace the following values.

- `CLIENT_ID` - your Auth0 application client id
- `ISSUER_BASE_URL` - absolute URL to your Auth0 application domain (ie: `https://accountName.auth0.com`)
- `SECRET` - a randomly rengerated string. You can generate one on the command line with the following `openssl rand -hex 32`

```bash
mv .env.example .env
```

3. Run the sample app:

```bash
npm start
```

The sample app will be served at `localhost:3000`.

## Fingerprint Auth0 Action Script

The core of this sample is the code within the Action script that runs in Auth0 during login. You can find that script at [auth0-scripts/login-action.js]().

## Full Tutorial

For a full guide on how to add Fingerprint to your Auth0 login flow, view our tutorial.

## Auth0 Support

> To learn more about Auth0 or for Auth0-related support, please view the [original sample README](https://github.com/auth0-samples/auth0-express-webapp-sample/tree/master/01-Login).
