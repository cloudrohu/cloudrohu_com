    function handleSearch() {
      const city = document.getElementById('citySelect').value;
      const query = document.getElementById('searchInput').value.trim();

      if (!city || !query) {
        alert('Please select a city and enter a search term.');
        return;
      }

      alert(`Searching for "${query}" in "${city}"...`);
      // TODO: replace with actual search logic or redirect
    }

    function categorySearch(categoryName) {
      document.getElementById('searchInput').value = categoryName;
      handleSearch();
    }