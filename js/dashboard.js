async function loadProjects() {
  const container = document.getElementById("projects");

  // Load config
  const res = await fetch("config/projects.json");
  const config = await res.json();

  for (const project of config.projects) {
    const card = document.createElement("div");
    card.className = "project";

    const title = document.createElement("h2");
    title.textContent = project.name;
    card.appendChild(title);

    // Link to full report
    const link = document.createElement("a");
    link.href = project.reportUrl;
    link.target = "_blank";
    link.textContent = "📑 Open Report";
    card.appendChild(link);

    // Trend container
    const trendDiv = document.createElement("div");
    trendDiv.className = "trend";
    card.appendChild(trendDiv);

    try {
      const dataRes = await fetch(project.dataUrl);
      const data = await dataRes.json();

      if (Array.isArray(data)) {
        const latest = data.slice(-10);

        latest.forEach(build => {
          const stats = build.data.statistic || {};
          let status = "passed";
          if (stats.failed > 0) status = "failed";
          else if (stats.broken > 0) status = "broken";
          else if (stats.skipped > 0) status = "skipped";

          const box = document.createElement("div");
          box.className = status;
          trendDiv.appendChild(box);
        });
      }
    } catch (e) {
      console.error(`Failed to load ${project.name}:`, e);
    }

    container.appendChild(card);
  }
}

loadProjects();
