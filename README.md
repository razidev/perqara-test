# Build REST API With Nodejs, JavaScript, and Mongoose

## Installation

### Manuel Installation
1. Clone the repo
   ```sh
    git clone https://github.com/razidev/razi-betest.git
   ```
2. Install the packages
   ```sh
    npm install
   ```
3. change environment variables
   ```sh
    change DATABASE_URL with your mongodb settings && for JWT_SECRET_KEY just random alphanumeric
   ```
4. npm start to run the api
5. export crud-api.json to postman and test on postman http://localhost:3000

### Test Linter Code
type this command to your terminal in root folder of this service:
```
npx eslint
```

### Test unit tests
for all tests use this command:
```
npm test
```

OR

for each test run the following command:
```
npm test <FILENAME>_test.js
```

### Documentations API
for the documentation visit http://localhost:3000/api-docs