async function loadProjects() {
  const container = document.getElementById("projects");

  try {
    const res = await fetch("config/projects.json");
    if (!res.ok) throw new Error("Failed to load config/projects.json");
    const config = await res.json();

    for (const project of config.projects) {
      const card = document.createElement("div");
      card.className = "project";

      const title = document.createElement("h2");
      title.textContent = project.name;
      card.appendChild(title);

      // summary line
      const summary = document.createElement("p");
      summary.textContent = "Loading results...";
      card.appendChild(summary);

      // trend container
      const trendDiv = document.createElement("div");
      trendDiv.className = "trend";
      card.appendChild(trendDiv);

      container.appendChild(card);

      try {
        const dataRes = await fetch(project.dataUrl);
        if (!dataRes.ok) throw new Error("Failed to load data " + project.dataUrl);
        const data = await dataRes.json();

        if (Array.isArray(data) && data.length > 0) {
          const latest = data.slice(-10);

          // summary from newest build
          const newest = latest[latest.length - 1]?.data || {};
          summary.textContent =
            `✔ ${newest.passed || 0} ❌ ${newest.failed || 0} ⚠ ${newest.broken || 0} ⏭ ${newest.skipped || 0}`;

          // trend squares
          latest.forEach(build => {
            const stats = build?.data || {};
            let status = "passed";
            if (stats.failed > 0) status = "failed";
            else if (stats.broken > 0) status = "broken";
            else if (stats.skipped > 0) status = "skipped";

            const box = document.createElement("div");
            box.className = status;
            box.style.display = "inline-block";
            box.style.width = "20px";
            box.style.height = "20px";
            box.style.margin = "2px";
            box.style.backgroundColor = status === "passed" ? "green" :
                                       status === "failed" ? "red" :
                                       status === "broken" ? "orange" : "gray";
            trendDiv.appendChild(box);
          });
        } else {
          summary.textContent = "No trend data available";
        }
      } c
      catch (e) {
        console.error(e);
        summary.textContent = "Failed to load trend data";
      }