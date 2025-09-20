for (const project of config.projects) {
  const card = document.createElement("div");
  card.className = "project";

  const title = document.createElement("h2");
  title.textContent = project.name;
  card.appendChild(title);

  const iframe = document.createElement("iframe");
  iframe.src = project.reportUrl;
  iframe.width = "100%";
  iframe.height = "600";   // adjust as needed
  iframe.style.border = "1px solid #ccc";
  card.appendChild(iframe);

  container.appendChild(card);
}
