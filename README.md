# Playwright API Tests
This repository contains Playwright tests for Exercise Event API, including file upload, polling, and deletion. It uses TypeScript, Zod for schema validation, UUID for unique IDs, and Pino for logging.
Does not contain CI/CD implementation

## Setup

install playwright browsers
```sh
npx playwright install
```
install dotenv for env variables management 
```sh
npm install dotenv
```
Install zod for schema validation 
```sh
npm install zod
```
Install uuid 
```sh
npm install uuid
```
install pino
```sh
bun add pino pino-pretty
```
## Execution
 run all tests and show report.
```sh
npm run test
```
run only tests tagged with @Api and show report.
```sh
npm run test:api 
```
run only API tests without automatically opening the report
```sh
npm run api 
```

## Environment Variables
By default, the environment is set to dev. To select another environment (e.g., production):
```sh
export ENVIRONMENT=prod
```

## Project Structure

	•	fixtures/ – Playwright fixtures for test data setup and teardown
	•	helpers/ – API helpers, file upload utilities, and logger
	•	schemas/ – Zod schemas for request/response validation
	•	tests/ – Playwright test files

## Notes
	•	Temporary files used for testing are automatically created and deleted.
	•	Exercise Events created during tests are automatically deleted after test completion.
	•	Polling is implemented to wait for the Exercise Event status to become scored.

## Example
```sh
npm run api 
```
This will:
	1.	Execute the API tests tagged with @Api.
	2.	Show logs in the console via Pino.
	3.	Clean up test data automatically (delete created Exercise Events).
	4.	The test report can be viewed with:
```sh
npx playwright show-report
```