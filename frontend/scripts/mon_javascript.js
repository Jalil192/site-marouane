document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("lightForm");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage = document.getElementById("newsletterMessage");
  const statsContainer = document.getElementById("statsContainer");

  const icons = {
    persecutes: "🕊️",
    malnutrition: "🍽️",
    pauvrete: "💰",
    education: "📚",
  };

  const colorMap = {
    persecutes: "skyblue",
    malnutrition: "orange",
    pauvrete: "gold",
    education: "purple",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.cause || !data.pays) return;

    try {
      // Envoi backend
      const response = await fetch(/api/illumine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Enregistrement stats côté backend (état partagé)
      const statsRes = await fetch("https://umanity-backend.onrender.com/api/get-stats");
      if (!statsRes.ok) {
        throw new Error(`HTTP error! status: ${statsRes.status}`);
      }

      const stats = await statsRes.json();

      const causeCount = stats.causeCount || {};
      const countryMap = stats.countryMap || {};

      causeCount[data.cause] = (causeCount[data.cause] || 0) + 1;
      if (!countryMap[data.pays]) countryMap[data.pays] = {};
      if (!countryMap[data.pays][data.cause]) countryMap[data.pays][data.cause] = 0;
      countryMap[data.pays][data.cause]++;

      const saveStatsRes = await fetch("https://umanity-backend.onrender.com/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ causeCount, countryMap }),
      });

      if (!saveStatsRes.ok) {
        throw new Error(`HTTP error! status: ${saveStatsRes.status}`);
      }

      renderStats(statsContainer, causeCount, countryMap);
      statsContainer.style.display = "block";

      setTimeout(() => {
        statsContainer.style.display = "none";
      }, 120000);

      form.reset();
    } catch (error) {
      console.error('Error:', error);
    }
  });

  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = newsletterForm.newsletterEmail.value.trim();
    if (!email) return;

    try {
      const response = await fetch("https://umanity-backend.onrender.com/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      newsletterMessage.textContent = `Merci ! Ton inscription à UmanitY est bien enregistrée : ${email}`;
      newsletterMessage.classList.remove("d-none");

      setTimeout(() => {
        newsletterMessage.classList.add("d-none");
      }, 5000);

      newsletterForm.reset();
    } catch (error) {
      console.error('Error:', error);
    }
  });

  function renderStats(container, causes, countries) {
    let html = `
      <div class="cause-stats">
        <h3 class="mb-3">🌍 Lumières allumées par cause</h3>
        <table class="table table-dark table-striped border-white border rounded">
          <thead><tr><th>Cause</th><th>Participants</th><th>Lumière</th></tr></thead><tbody>`;

    for (const cause in causes) {
      html += `
        <tr>
          <td>${icons[cause]} ${capitalize(cause)}</td>
          <td>${causes[cause]}</td>
          <td><span class="light-circle" style="--intensity:${causes[cause]}; color:${colorMap[cause]}"></span></td>
        </tr>`;
    }

    html += `</tbody></table>
      <h4 class="mt-4">📍 Répartition par pays</h4><ul class="list-unstyled">`;

    for (const country in countries) {
      const entries = countries[country];
      const text = Object.entries(entries)
        .map(([cause, count]) => `${icons[cause] || ""} ${count}`)
        .join(", ");
      html += `<li><strong>${country}</strong> → ${text}</li>`;
    }

    html += `</ul></div>`;
    container.innerHTML = html;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});

