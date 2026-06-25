export default function HomePage() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>CarryMate</h1>
      <p>Diaspora Logistics Marketplace — Phase 1M scaffold complete.</p>
      <p>
        <strong>Environment:</strong> {process.env.NODE_ENV}
      </p>
      <p>
        Full sender portal, traveler portal, and admin panel are built in Phase 2 onwards.
      </p>
    </main>
  );
}
