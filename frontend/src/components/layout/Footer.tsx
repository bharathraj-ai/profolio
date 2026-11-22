export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '1.5rem 0' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.75)' }}>
           {year} Bharathraj S. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
