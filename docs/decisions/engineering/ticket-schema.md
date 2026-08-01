# Foundry Engineering Standard

## Ticket Schema

All engineering work within Foundry is represented by a ticket.

Tickets are stored in `data/tickets.json` and follow the schema below.

```json
{
    "id": "FND-034",
    "projectId": "foundry",
    "order": 34,

    "title": "",

    "description": "",

    "acceptanceCriteria": [],

    "notes": "",

    "labels": [],

    "dependencies": [],

    "status": "planned",

    "priority": "medium",

    "estimate": 3,

    "milestone": "",

    "release": "",

    "created": "",

    "completed": null,

    "commitMessage": "",

    "branchName": ""
}
```

---

# Field Reference

| Field | Description |
|--------|-------------|
| id | Immutable ticket identifier. |
| projectId | Owning project. |
| order | Display order within the project. |
| title | Short engineering summary. |
| description | Detailed description of the work. |
| acceptanceCriteria | List of conditions required for completion. |
| notes | Engineering notes gathered during implementation. |
| labels | Searchable tags describing the work. |
| dependencies | List of ticket IDs that must be completed first. |
| status | Current ticket state. |
| priority | Relative importance. |
| estimate | Relative engineering effort (story points). |
| milestone | Associated milestone. |
| release | Target release version. |
| created | Ticket creation date (ISO-8601). |
| completed | Completion date or `null`. |
| commitMessage | Standard Git commit message. |
| branchName | Standard Git branch name. |

---

# Status Values

The following values are permitted.

| Status | Description |
|----------|-------------|
| planned | Ticket has been created but work has not started. |
| in-progress | Active engineering work. |
| blocked | Cannot proceed due to dependencies or external issues. |
| review | Awaiting verification or review. |
| completed | Fully implemented and accepted. |
| cancelled | Work will not be completed. |

---

# Priority Values

| Priority | Meaning |
|-----------|---------|
| critical | Release blocker. |
| high | Important feature or fix. |
| medium | Normal engineering work. |
| low | Nice-to-have or minor enhancement. |

---

# Estimate Scale

Foundry uses a lightweight story point system.

| Estimate | Typical Effort |
|----------:|----------------|
| 1 | Less than one hour |
| 2 | One to two hours |
| 3 | Half day |
| 5 | One day |
| 8 | Two to three days |
| 13 | Epic — should normally be split into multiple tickets |

Estimates represent relative complexity rather than elapsed time.

---

# Labels

Labels provide lightweight categorisation.

Examples include:

- frontend
- backend
- ui
- ux
- crud
- validation
- persistence
- automation
- dashboard
- analytics
- git
- documentation
- testing
- refactor
- performance

Labels should remain concise and reusable.

---

# Dependencies

Dependencies define prerequisite work.

```json
"dependencies": [
    "FND-034",
    "FND-035"
]
```

A ticket cannot be considered **Ready** until all dependencies have been completed.

Dependencies should reference immutable ticket IDs.

---

# Ticket ID Policy

Ticket IDs are immutable.

Once assigned:

- They are never changed.
- They are never reused.
- They are never renumbered.

Historical tickets remain part of the engineering record even if removed from the active backlog.

---

# Commit Message Convention

Every ticket defines its canonical commit message.

Example:

```
FND-034: Add ticket editing workspace
```

All commits associated with a ticket should use this format where practical.

---

# Branch Naming Convention

Every ticket defines its standard feature branch.

Example:

```
feature/FND-034-ticket-editor
```

Branches should follow the pattern:

```
feature/<ticket-id>-<slug>
```

---

# Engineering Principles

Foundry follows five engineering principles.

## 1. Single Source of Truth

Information should only exist once.

Derived information should never be manually duplicated.

---

## 2. Engineer Only What Cannot Be Inferred

If Foundry can calculate a value automatically, it should.

Examples include:

- Ticket ID
- Order
- Commit Message
- Branch Name
- Creation Date

---

## 3. Small Vertical Slices

Work should be delivered in small, testable increments.

Avoid long-running feature branches.

---

## 4. Ticket Driven Development

Every meaningful engineering change begins with a ticket.

The ticket defines:

- Scope
- Acceptance Criteria
- Release
- Milestone
- Commit Convention

---

## 5. Ship Frequently

Working software is preferred over unfinished perfection.

Small, completed tickets are favoured over large unfinished epics.