document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  let currentPage = 1;

  async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
  }

  async function renderPlanets() {
    // Show loading spinner while fetching data
    app.innerHTML = '<div class="loader"></div>';

    const apiUrl = `https://swapi.dev/api/planets/?format=json&page=${currentPage}`;
    const data = await fetchData(apiUrl);

    // Remove loading spinner before rendering planets
    app.innerHTML = "";

    for (const planet of data.results) {
      const planetCard = document.createElement("div");
      planetCard.classList.add("planet-card");
      planetCard.innerHTML = `
          <h2>${planet.name}</h2>
          <p>Climate: ${planet.climate}</p>
          <p>Population: ${planet.population}</p>
          <p>Terrain: ${planet.terrain}</p>
          <!-- Add a small heading for the list of residents -->
          <h3 class="resident-heading">Residents:</h3>
          <ul class="resident-list" id="residentList-${planet.name}"></ul>
        `;

      app.appendChild(planetCard);

      const residentList = document.getElementById(
        `residentList-${planet.name}`
      );

      if (planet.residents.length > 0) {
        for (const residentUrl of planet.residents) {
          const residentData = await fetchData(residentUrl);
          const residentItem = document.createElement("li");
          residentItem.classList.add("resident-item");
          residentItem.innerHTML = `
              ${residentData.name} - Height: ${residentData.height}, Mass: ${residentData.mass}, Gender: ${residentData.gender}
            `;
          residentList.appendChild(residentItem);
        }
      } else {
        const noResidentsItem = document.createElement("li");
        noResidentsItem.classList.add("resident-item");
        noResidentsItem.textContent = "No Residents found!";
        residentList.appendChild(noResidentsItem);
      }
    }

    renderPagination(data.count);
  }

  function renderPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / 10);
    const pagination = document.createElement("div");
    pagination.classList.add("pagination");

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = createPaginationButton(i, i === currentPage, () => {
        currentPage = i;
        renderPlanets();
      });

      pagination.appendChild(pageButton);
    }

    app.appendChild(pagination);
  }

  function createPaginationButton(label, isActive, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.disabled = isActive;
    button.addEventListener("click", onClick);

    if (isActive) {
      button.classList.add("active");
    }

    return button;
  }

  renderPlanets();
});
