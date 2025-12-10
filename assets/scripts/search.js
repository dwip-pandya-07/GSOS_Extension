// search.js - Search functionality
/**
 * Initialize search functionality
 */
export function initSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();

        if (query) {
            // Redirect to Google search in new tab
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            searchInput.value = '';
        }
    });

    // Optional: Add focus effects if needed via JS, though CSS :focus is usually enough
}
