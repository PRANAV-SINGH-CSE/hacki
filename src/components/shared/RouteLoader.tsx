const RouteLoader = () => (
  <div className="page-loader" aria-hidden="true">
    <div className="page-loader__frame">
      <div className="page-loader__nav">
        <div className="page-loader__brand">
          <div className="skeleton skeleton-circle" />
          <div className="skeleton skeleton-wordmark" />
        </div>
        <div className="page-loader__nav-items">
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
          <div className="skeleton skeleton-pill" />
        </div>
      </div>
      <div className="page-loader__hero">
        <div className="page-loader__hero-left">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-subtitle" />
          <div className="page-loader__text-lines">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line is-short" />
          </div>
          <div className="page-loader__actions">
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button is-ghost" />
          </div>
        </div>
        <div className="page-loader__hero-right">
          <div className="page-loader__radar">
            <div className="skeleton skeleton-ring" />
            <div className="skeleton skeleton-ring is-inner" />
            <div className="skeleton skeleton-dot" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RouteLoader;
