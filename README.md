# jobsearch
Software to manage all of the connections and conversations in your job search

# Getting Started
The UI is a node application.  Here's an easy way to get going:
1. Install homebrew - https://brew.sh/
   - export PATH="/usr/local/bin:$PATH"
2. Install node and nps - *brew install node*
3. Install typescript
   - npm install -g typescript
4. Install a polling library - *- npm i react-polling --save*
5. Install a markdown library - *npm install react-markdown*
   - See: https://www.npmjs.com/package/react-markdown
6. You will need to run the API service if the application is going to be functional: https://github.com/joddyjods/jobsearch-api
7. Set up the material UI support - https://mui.com/material-ui/getting-started/installation/
8. npm install googleapis 
      - https://github.com/googleapis/google-api-nodejs-client
      - https://developers.google.com/identity/sign-in/web/sign-in
9.  npm install @googleapis/docs
10. Set up google login support - - npm install gapi-script react-google-login --legacy-peer-deps
   - Following this example: https://www.youtube.com/watch?v=HtJKUQXmtok
11. npm install @date-io/dayjs --legacy-peer-deps
12. npm install dotenv


# Running the application
- **npm** start - note that it will run on port 3000 by default
- **npm** test - runs the test runner
- **npm** start - starts the development server

# TODO
- Revoke and replace the client ID from google cloud
- Fix the highlighting on the selected opportunity (it goes away)
- Make the + button float so that it doesn't move up with the opportunities
- Make the login page more descriptive
- Allow editing of interactions
- Add status setters to the interactions to update the opportunity statuses
