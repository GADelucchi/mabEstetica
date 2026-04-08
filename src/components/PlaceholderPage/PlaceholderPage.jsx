import "./PlaceholderPage.css";

const PlaceholderPage = ({ title, description }) => {
  return (
    <section className="placeholder-page">
      <div className="placeholder-page__card">
        <p className="placeholder-page__eyebrow">Sección en preparación</p>
        <h2>{title}</h2>
        <p className="placeholder-page__description">{description}</p>
      </div>
    </section>
  );
};

export default PlaceholderPage;