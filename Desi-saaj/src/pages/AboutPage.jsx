import "./../css/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <h1>About Desi Saaj</h1>
        <p>
          Celebrating Indian fashion with elegance, comfort, and timeless style.
        </p>
      </section>

      {/* STORY */}
      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Desi Saaj was born out of a love for Indian ethnic wear and modern
          fashion. We believe clothing is not just about style — it’s about
          identity, confidence, and tradition woven into every thread.
        </p>
        <p>
          From everyday kurtis to statement ethnic pieces, our collections are
          designed to make you feel graceful, confident, and beautifully you.
        </p>
      </section>

      {/* VALUES */}
      <section className="about-values">
        <div className="value-card">
          <h3>🌿 Quality First</h3>
          <p>
            We carefully select fabrics and designs that feel as good as they
            look.
          </p>
        </div>

        <div className="value-card">
          <h3>🧵 Crafted with Care</h3>
          <p>
            Every piece reflects attention to detail, comfort, and durability.
          </p>
        </div>

        <div className="value-card">
          <h3>💚 Made for You</h3>
          <p>
            Fashion that blends tradition with modern elegance for every woman.
          </p>
        </div>
      </section>

      {/* PROMISE */}
      <section className="about-section promise">
        <h2>Our Promise</h2>
        <p>
          At Desi Saaj, we promise premium quality, honest pricing, and designs
          that celebrate Indian beauty — delivered with care and love.
        </p>
      </section>

    </div>
  );
}
