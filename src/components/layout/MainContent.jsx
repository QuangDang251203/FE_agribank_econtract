import '../../styles/mainContent.css';

function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="main-icon back-icon">
      <path
        d="M9.9 3.4 5.3 8l4.6 4.6-1.1 1.1L3 8l5.8-5.7 1.1 1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TabIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="main-icon tab-icon">
      <path
        d="M8 1.7a4.3 4.3 0 1 0 4.3 4.3H8V1.7Zm5 4.3A5 5 0 1 1 8 1v.7A4.3 4.3 0 0 1 13 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="main-icon plus-icon">
      <path
        d="M7.25 3.2h1.5v4.05h4.05v1.5H8.75v4.05h-1.5V8.75H3.2v-1.5h4.05V3.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="main-icon more-icon">
      <circle cx="3" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="13" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}

const tabs = [
  { id: 1, label: 'Tab', count: 25, active: true },
  { id: 2, label: 'Tab', count: 25 },
  { id: 3, label: 'Tab', count: 25 },
  { id: 4, label: 'Tab', count: 25 },
];

function MainContent() {
  return (
    <main className="content-area">
      <section className="content-panel">
        <div className="breadcrumbs" aria-label="Breadcrumb">
          <span>Home</span>
          <span>/</span>
          <span>Application Center</span>
          <span>/</span>
          <strong>An Application</strong>
        </div>

        <div className="content-header-row">
          <div className="content-title-group">
            <button type="button" className="back-button" aria-label="Go back">
              <BackIcon />
            </button>

            <div>
              <div className="content-heading-line">
                <h1>Title</h1>
                <p>This is a subtitle</p>
              </div>
            </div>
          </div>

          <div className="content-actions">
            <button type="button" className="button button-primary">
              <PlusIcon />
              <span>Khởi tạo khoản vay</span>
            </button>
            <button type="button" className="button button-secondary">
              Default
            </button>
            <button type="button" className="button button-icon" aria-label="More actions">
              <MoreIcon />
            </button>
          </div>
        </div>

        <div className="tabs-row" role="tablist" aria-label="Application tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.active ? 'true' : 'false'}
              className={`tab-button ${tab.active ? 'active' : ''}`}
            >
              <TabIcon />
              <span>{tab.label}</span>
              <em>{tab.count}</em>
            </button>
          ))}
        </div>

        <div className="content-body" />
      </section>
    </main>
  );
}

export default MainContent;
