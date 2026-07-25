export function renderDashboardView() {
    return `
          <section class="workspace" aria-label="Workspace">
        <div class="dashboard-grid">
          <section class="dashboard-card">
            <header class="dashboard-card__header">
              Current Project
            </header>

            <div 
                class="dashboard-card__body"
                data-bind="currentProject">
            </div>  
  
          </section>

          <section class="dashboard-card">
            <header class="dashboard-card__header">
              Version
            </header>

            <div
              class="dashboard-card__body"
              data-bind="version">
          </div>
          </section>

          <section class="dashboard-card">
            <header class="dashboard-card__header">
              Sprint
            </header>

            <div
                class="dashboard-card__body"
                data-bind="currentSprint">
            </div>
          </section>

          <section class="dashboard-card">
            <header class="dashboard-card__header">
              Current Ticket
            </header>

            <div
                class="dashboard-card__body"
                data-bind="currentTicket">
            </div>
          </section>

          <section class="dashboard-card development-progress" aria-labelledby="development-progress-title">
            <header class="dashboard-card__header" id="development-progress-title">
              Development Progress
            </header>

            <div class="dashboard-card__body development-progress__body">
              <div class="development-progress__summary">
                <span class="development-progress__percentage" data-bind="developmentProgressPercentage">0%</span>
                <span class="development-progress__tickets" data-bind="developmentProgressTickets">0 / 0 completed tickets</span>
              </div>

              <div
                class="development-progress__track"
                data-development-progress-bar
                role="progressbar"
                aria-label="Development progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0">
                <div class="development-progress__indicator"></div>
              </div>
            </div>
          </section>
        </div>
      </section>
    `;
}