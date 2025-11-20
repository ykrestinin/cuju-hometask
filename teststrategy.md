# Part 2: Negative & Edge Case Scenarios

Even with Zod schema validation on the client side, the API may still return unexpected behavior. These scenarios ensure backend stability, proper validation, and correct error handling.

## 1. Invalid Identifiers

- Non-existent `userId`
- Non-existent `exerciseId`
- Invalid `exerciseEventId` during polling/deletion

**Goal:** verify correct backend error codes (404 / 400), not schema validation.

## 2. Invalid File Upload

- Uploading a wrong file type
- Using an incorrect `Content-Type`
- Uploading an empty file

**Goal:** ensure S3/presigned URL validation reacts properly.

## 3. Polling Edge Cases

- Status never becomes `scored`
- API returns unexpected intermediate statuses
- API temporarily returns 500/503

**Goal:** check retry robustness and correct failure reporting.

## 4. Create Event Validation

- File size below minimum / above maximum
- Missing file size

**Goal:** confirm backend constraints (Zod validation happens before request on the client).

## 5. Unauthorized / Forbidden Requests

Even if there is no specification for it right now, this area should always be covered:

- Missing auth headers
- Using expired tokens

**Goal:** ensure correct security enforcement (401/403).

## 6. Deletion Errors

- Deleting an event twice
- Deleting an event that belongs to another user

**Goal:** backend should reject invalid delete operations.

# Handling Long-Running Event-Driven Workflows

## 1. If real processing must be tested ("Full e2e") – theoretical thoughts

- Increase polling interval and max retries for the environment where these tests are running
- Add more timeouts and clear failure messages
- Test the long-running scoring worker in isolation on integration level (e.g., not through the API or e2e)
- Run these tests in a separate CI pipeline

## 2. If real processing could be avoided

- Mock the scoring/processing service so the API immediately returns a final status
- Use a test-mode for the backend — introduce a backend feature flag which forces the workflow to complete immediately or skip heavy processing

# Framework Principles

Basic principles of automation framework organization are defined in ISTQB standard: [ISTQB framework principles](https://ibb.co/pBYsGxZB)

In practice, this means:

- Structuring tests for maintainability and scalability:
**use patterns** like PageObject/Factory, singleton, data-diven etc.
**reuse code**, use functions/methods to avoid duplication
**keep сlear and readable tests**, the name and description reflects purpose of the test
**keep еest isolation**, avoid dependencies between test
**keep modularity**, tests and helper functions are separated logically
**keep the layer of abstraction**, so that test are not using specific ui or implementation details - changes are handled without test changes

- Clear separation of test data, fixtures
**keep data separated**, should be separated from logic
**use fixtures/hooks**, allows to set the needed "state" before/after test 

- Proper handling of configuration and environments
**no hardcode**, run your test on any env by switching configs
**separated from logic**,

- Support for parallel test execution without conflicts

- Logging and reporting for all key steps

# Managing configuration across different environments
What should be handled
- Separation of configuration from tests
- Support for multiple environments
- Use of environment variables
- Centralized settings management

# Managing test data lifecycle
This is really huge topic, I'll try to keep it short.

## It is important, because
- Most critical topic for parallelization - prevents flakyness and conflicts
- Makes tests repeatable
- Increase maintanability


**Basic lifecyckle**
1.	Creation - generation or provisioning data
2.	Usage 
3.	Maintenance - updating or versioning data
4.	Cleanup/Teardown - removing or resetting data

# o	Handling parallel test execution and potential conflicts


- **starts from test-design**, test should be always developed looking back to parallelization
- **use isolated data**, test should use unique/independet data
- **use setup and teardown on test level**, not global
- **avoid shared state**, no globals

## UI-test specific points

- **use isolated browser contexts** - no inersections of cookies, local starages and sessions
- **right synchronization** - use right awaits for elements, wait for visibility, state etc, don't use hardcoded sleeps




