import '../../styles/layoutPage.css';

function LayoutPageFrame({ title, description }) {
  return (
    <main className="layout-page">
      <section className="layout-page__panel">
        <div className="layout-page__titlebar">
          <h1>{title}</h1>
        </div>

        <div className="layout-page__workspace" aria-label={description || title} />
      </section>
    </main>
  );
}

export default LayoutPageFrame;


