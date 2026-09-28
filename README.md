# Task Tracker CLI

A command-line task tracker built with TypeScript, NestJS, and nest-commander. Manage tasks from your terminal and persist them locally in a JSON file.

Project URL: [Task Tracker on roadmap.sh](https://roadmap.sh/projects/task-tracker)

## Features

- Add, update, and delete tasks.
- Mark tasks as in progress or done.
- List all tasks or filter by status: `todo`, `in-progress`, or `done`.
- Assign a unique UUID to each task.
- Store tasks locally without a database or external service.

## Getting Started

Use Node.js 24 and pnpm. From the project directory, install dependencies:

```bash
pnpm install
```

Display the available commands:

```bash
pnpm run start:cli task-cli --help
```

## Usage

Run commands from the project directory. Wrap descriptions containing spaces in quotes, and replace `<id>` with the UUID printed when adding or listing a task.

### Add a task

```bash
pnpm run start:cli task-cli add "Buy groceries"
```

New tasks start with the `todo` status. Example output:

```text
Task added successfully (ID: 550e8400-e29b-41d4-a716-446655440000)
```

### Update or delete a task

```bash
pnpm run start:cli task-cli update <id> "Buy groceries and cook dinner"
pnpm run start:cli task-cli delete <id>
```

### Change a task's status

```bash
pnpm run start:cli task-cli mark-in-progress <id>
pnpm run start:cli task-cli mark-done <id>
```

### List tasks

```bash
# List all tasks
pnpm run start:cli task-cli list

# Filter by status
pnpm run start:cli task-cli list todo
pnpm run start:cli task-cli list in-progress
pnpm run start:cli task-cli list done
```

### Command Reference

Each command follows `pnpm run start:cli task-cli`.

| Command                       | Alias | Description                           |
| ----------------------------- | ----- | ------------------------------------- |
| `add "<description>"`         | `a`   | Create a task with the `todo` status. |
| `update <id> "<description>"` | `u`   | Change a task's description.          |
| `delete <id>`                 | `d`   | Delete a task.                        |
| `mark-in-progress <id>`       | `mip` | Set the status to `in-progress`.      |
| `mark-done <id>`              | `md`  | Set the status to `done`.             |
| `list [status]`               | `l`   | List all tasks or filter by status.   |

For example, `pnpm run start:cli task-cli a "Read a book"` uses the short alias for `add`.

## Data Storage

Tasks are stored as an array in `data.json` in the current working directory. The application creates the file automatically when needed, and Git ignores it. Running the CLI from a different directory uses a separate data file.

Each task contains:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "Buy groceries",
  "status": "todo",
  "createdAt": "2026-09-28T08:00:00.000Z",
  "updatedAt": "2026-09-28T08:00:00.000Z"
}
```

Currently, both timestamps are set when a task is created; editing a task does not refresh `updatedAt`. There is no command to reset a task to `todo`.

## Build and Run

Compile the application and run the generated JavaScript:

```bash
pnpm run build
node dist/main.js task-cli --help
node dist/main.js task-cli list
```

## Project Structure

```text
src/
├── main.ts                 # CLI entry point
├── app.module.ts           # Root NestJS module
└── task/
    ├── commands/           # Command handlers and aliases
    ├── task.module.ts      # Task module and providers
    ├── task.schema.ts      # Task model and status definitions
    ├── task.service.ts     # Task operations
    └── task.repository.ts  # JSON file persistence
```

## Development

```bash
pnpm run build   # Compile TypeScript
pnpm run lint    # Run ESLint with automatic fixes
pnpm run format  # Format source and test files with Prettier
```

Run the end-to-end CLI test:

```bash
pnpm run test:e2e
```

The test runs the CLI in a temporary directory and verifies task creation, description updates, status changes, filtering, and deletion using real JSON persistence. Temporary data is removed after the test.
