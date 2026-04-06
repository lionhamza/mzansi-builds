function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>MzansiBuilds Dashboard</h1>
      <p style={styles.subheading}>Build in public. Grow together.</p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Create Project</h2>
          <p>Start a new project and share it with the community.</p>
        </div>

        <div style={styles.card}>
          <h2>Developer Feed</h2>
          <p>See what other developers are building.</p>
        </div>

        <div style={styles.card}>
          <h2>My Projects</h2>
          <p>Manage and update your active projects.</p>
        </div>

        <div style={styles.card}>
          <h2>Celebration Wall 🎉</h2>
          <p>See completed projects from the community.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    padding: "40px"
  },
  heading: {
    color: "#00ff88",
    marginBottom: "10px"
  },
  subheading: {
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },
  card: {
    backgroundColor: "#111",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #00ff88"
  }
};

export default Dashboard;