(function () {
  "use strict";

  var state = {
    breeds: [],
    search: "",
    coat: "",
    energy: ""
  };

  var els = {
    grid: document.getElementById("breeds"),
    search: document.getElementById("search"),
    coat: document.getElementById("coat-filter"),
    energy: document.getElementById("energy-filter"),
    count: document.getElementById("count"),
    empty: document.getElementById("empty")
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort();
  }

  function populateFilter(select, values) {
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function matches(breed) {
    if (state.coat && breed.coatLength !== state.coat) return false;
    if (state.energy && breed.energyLevel !== state.energy) return false;
    if (state.search) {
      var haystack = [
        breed.name,
        breed.origin,
        breed.temperament,
        breed.coatLength
      ]
        .join(" ")
        .toLowerCase();
      if (haystack.indexOf(state.search) === -1) return false;
    }
    return true;
  }

  function cardHtml(breed) {
    return (
      '<article class="breed-card">' +
      "<h2>" + escapeHtml(breed.name) + "</h2>" +
      '<p class="origin">Origin: ' + escapeHtml(breed.origin) + "</p>" +
      '<p class="temperament">' + escapeHtml(breed.temperament) + "</p>" +
      '<ul class="specs">' +
      '<li><span class="label">Coat</span>' + escapeHtml(breed.coatLength) + "</li>" +
      '<li><span class="label">Weight</span>' + escapeHtml(breed.weightRange) + "</li>" +
      '<li><span class="label">Life expectancy</span>' + escapeHtml(breed.lifeExpectancy) + "</li>" +
      '<li><span class="label">Energy</span>' + escapeHtml(breed.energyLevel) + "</li>" +
      '<li><span class="label">Grooming</span>' + escapeHtml(breed.groomingEffort) + "</li>" +
      "</ul>" +
      '<p class="fun-fact"><strong>Fun fact:</strong> ' + escapeHtml(breed.funFact) + "</p>" +
      "</article>"
    );
  }

  function render() {
    var visible = state.breeds.filter(matches);
    els.grid.innerHTML = visible.map(cardHtml).join("");
    els.empty.hidden = visible.length !== 0;
    els.count.textContent =
      "Showing " + visible.length + " of " + state.breeds.length + " breeds";
  }

  function bindControls() {
    els.search.addEventListener("input", function (e) {
      state.search = e.target.value.trim().toLowerCase();
      render();
    });
    els.coat.addEventListener("change", function (e) {
      state.coat = e.target.value;
      render();
    });
    els.energy.addEventListener("change", function (e) {
      state.energy = e.target.value;
      render();
    });
  }

  function init(breeds) {
    state.breeds = breeds.slice().sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    populateFilter(els.coat, uniqueSorted(breeds.map(function (b) { return b.coatLength; })));
    populateFilter(els.energy, uniqueSorted(breeds.map(function (b) { return b.energyLevel; })));
    bindControls();
    render();
  }

  fetch("data/breeds.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to load breed data (" + res.status + ")");
      return res.json();
    })
    .then(init)
    .catch(function (err) {
      els.grid.innerHTML =
        '<p class="empty">Sorry, the breed data could not be loaded.</p>';
      els.count.textContent = "";
      console.error(err);
    });
})();
