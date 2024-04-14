Counsil Webpage
===============

# Overview:
* A website for anyone to view the postholes our system has detected.
* Council members can log into staff-accounts to remove potholes from the system.
* A google map with indicators for pothole locations.

# How to use:
### Note:
To run this project you will need [node](https://nodejs.org/en/download)

## from project root:
```bash
  cd Frontend/councilSite
  npm start
```
Starts the development server.

```bash
  npm run build
```
Bundles the app into static files for production.

```bash
  npm run test
```
Runs the test suites for the front end.

# Note That:
  The webpage makes api calls to its own back-end.<br>
  Running the back-end simultanuously is required <br>
  for the page to function.<br>
  Make sure the constant "APILINK" in App.js is set to the correct path linking to the back-end.
  ```bash
    Frontend\councilSite\src\components\App.js
  ```

# To start backend:

## from project root:
```bash
  cd Backend
  npm start
```
Starts back-end server.