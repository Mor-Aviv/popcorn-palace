# Instructions.md

## Setup
To get started, clone this repository to your local machine and navigate into the project folder.
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start PostgreSQL with Docker:
   ```bash
   docker compose up -d
   ```
   Docker is used to run a local PostgreSQL instance, which stores all data related to movies, showtimes, and bookings during development and testing.

3. Run the app:
   - Development: `npm run start`
   - Watch: `npm run start:dev`
   - Production: `npm run build && npm run start:prod`

---

## Testing

- Unit tests:
  ```bash
  npm run test
  ```

- End-to-end tests:
  ```bash
  npm run test:e2e
  ```
  > Runs sequentially using `--runInBand` to avoid DB race conditions.

- Coverage report:
  ```bash
  npm run test:cov
  ```

---

## STRUCTURE

The project is organized as follows:

```text
src/
├── movies/
│   ├── dto/
│   │   └── create-movie.dto.ts
│   ├── entities/
│   │   └── movie.entity.ts
│   ├── unit-tests/
│   │   ├── movies.controller.spec.ts
│   │   └── movies.service.spec.ts
│   ├── movies.controller.ts
│   ├── movies.module.ts
│   └── movies.service.ts
│
├── showtimes/   # same structure as movies 
├── bookings/    # same structure as movies
├── app.module.ts
└── main.ts

test/
├── movies.e2e-spec.ts
├── showtimes.e2e-spec.ts
├── bookings.e2e-spec.ts
├── jest-e2e.json
└── utils/
    └── resetDatabase.ts 

```




---





