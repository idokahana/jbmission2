("use strict");

(() => {
  const getData = (url) => {
    return fetch(url).then((response) => response.json());
  };

  const generateCountriesNamesTable = (data) => {
    const result = data

      .map((country) => {
        const {
          name: { common },
          population,
        } = country;
        return `
  
      
        <tr>
          <td>${common}</td>
          <td>${population}</td>
        </tr>
     
            `;
      })
      .reduce((cum, cur) => cum + cur, "");

    return `
    <thead>
    <tr>
      <th>Country Name</th>
      <th>Number of citizens</th>
    </tr>
  </thead>
  <tbody>
  ${result}

  </tbody>
   `;
  };

  const generateLanguageTable = (data) => {
    const languageCount = {};

    data.forEach((country) => {
      if (country.languages) {
        Object.values(country.languages).forEach((language) => {
          if (languageCount[language]) {
            languageCount[language]++;
          } else {
            languageCount[language] = 1;
          }
        });
      }
    });

    const languageRows = Object.keys(languageCount).map((language) => {
      return `<tr><td>${language}</td><td>${languageCount[language]}</td></tr>`;
    });

    const rowsHTML = languageRows.reduce((acc, row) => acc + row, "");

    return `
      <thead>
        <tr>
          <th>Language</th>
          <th>Number of Countries</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}

      </tbody>
    `;
  };

  const generateCountriesRegionTable = (data) => {
    const regions = [...new Set(data.map((country) => country.region))];
    const regionCounts = regions.map((region) => {
      const count = data.filter((country) => country.region === region).length;
      return `<tr><td>${region}</td><td>${count}</td></tr>`;
    });

    const rowsHTML = regionCounts.reduce((cum, cur) => cum + cur, "");

    return `
    <thead>
    <tr>
      <th>Region</th>
      <th>Number of countries</th>
    </tr>
  </thead>
  <tbody>
  ${rowsHTML}


  </tbody>
   `;
  };
  const generateStatsTable = (data) => {
    const totalCountries = data.length;
    const totalCountriesPopulation = data.reduce(
      (total, country) => total + (country.population || 0),
      0
    );
    const averagePopulation = totalCountriesPopulation / totalCountries;
    return `
    <div>Total countries result: ${totalCountries}</div>
    <div>Total Countries Population: ${totalCountriesPopulation}</div>
    <div>Average Population: ${averagePopulation.toFixed(0)}</div>
    <hr/>
      `;
  };

  const renderStatsTable = (newHTML) =>
    (document.getElementById("statsDiv").innerHTML = newHTML);

  const renderCountriesNamesTable = (newHTML) =>
    (document.getElementById("countriesNamesTable").innerHTML = newHTML);

  const renderCountriesRegionTable = (newHTML) =>
    (document.getElementById("countriesRegionTable").innerHTML = newHTML);

  const renderCountriesLanguageTable = (newHTML) =>
    (document.getElementById("countryLanguageTable").innerHTML = newHTML);

  document.getElementById("allBtn").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const allData = await getData("https://restcountries.com/v3.1/all");
      generateLanguageTable(allData);
      const statsTableHTML = generateStatsTable(allData);
      const nameTableHTML = generateCountriesNamesTable(allData);
      const regionTableHTML = generateCountriesRegionTable(allData);
      const languageTableHTML = generateLanguageTable(allData);
      renderCountriesLanguageTable(languageTableHTML);
      renderCountriesRegionTable(regionTableHTML);
      renderCountriesNamesTable(nameTableHTML);
      renderStatsTable(statsTableHTML);
    } catch (e) {
      console.warn(e);
    }
  });
  document
    .getElementById("countryBtn")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const name = document.getElementById(`countryInput`).value;
        if (!name) throw new Error(`please enter an country`);
        const countryData = await getData(
          `https://restcountries.com/v3.1/name/${name}`
        );

        const statsTableHTML = generateStatsTable(countryData);
        const nameTableHTML = generateCountriesNamesTable(countryData);
        const regionTableHTML = generateCountriesRegionTable(countryData);
        const languageTableHTML = generateLanguageTable(countryData);
        renderCountriesLanguageTable(languageTableHTML);
        renderCountriesRegionTable(regionTableHTML);
        renderCountriesNamesTable(nameTableHTML);
        renderStatsTable(statsTableHTML);
      } catch (e) {
        console.warn(e);
      }
    });
})();
