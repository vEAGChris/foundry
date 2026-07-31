# v0.5.0 - Project-aware Tooling - 2026-07-31

## Added

- Project-aware dashboard.
- Project-aware ticket filtering.
- Project-aware milestone support.
- Project-aware release support.
- Persistent active project selection.
- Project-aware data model across core entities.

## Changed

- Projects, tickets, milestones and releases now consistently use `projectId`.
- Dashboard model now resolves project relationships through a unified project model.
- Release history updated to reflect the application's development timeline.

## Technical

- Introduced project filtering helpers for tickets, milestones and releases.
- Improved separation between repositories, application state and rendering.
- Prepared the data model for future Milestones and Releases views.

# v0.4.0 - Projects - 2026-07-30

## Added

- Multi-project support
- Active project state
- Project selection workflow
- Persistent active project using Local Storage
- Responsive Projects workspace
- Active project highlighting
- Current project badge

## Imrpoved

- Sidebar navigation state
- Project workspace layout
- Application UX and navigation flow
- Visual consistency across dashboard and projects

## Internal 

- Removed assumption that the first project is always active
- Introduced reusable active project architecture for future models
- Continued separation of repositories, application state and stateless views

# v0.3.0 - Live Dashboard

## Added

- Live project configuration loading
- Ticket data model
- Milestone data model
- Release data model
- Development progress widget
- Automatic progress calculation
- Active ticket resolution
- Project branding

## Changed

- Dashboard now driven entirely from JSON
- CSS reorganised into maintainable sections
- Improved application shell layout

## Internal

- Introduced project domain model
- Improved separation between data and presentation