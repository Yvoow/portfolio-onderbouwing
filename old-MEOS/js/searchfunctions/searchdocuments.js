document.addEventListener('DOMContentLoaded', function() {
    var searchInput = document.getElementById('searchInput');
    var noResultsMsg = document.getElementById('no-results-message'); 
    var hiddenOnNoResultElements = document.querySelectorAll('.hiddenOnNoResult'); 
    var found = false; 

    searchInput.addEventListener('input', function() {
        var searchText = searchInput.value.toLowerCase();
        var h3Elements = document.querySelectorAll('.document-card h3');
        found = false; 

        h3Elements.forEach(function(h3) {
            var card = h3.parentElement;
            if (h3.textContent.toLowerCase().includes(searchText)) {
                card.style.display = ''; 
                found = true; 
            } else {
                card.style.display = 'none';
            }
        });

        noResultsMsg.style.display = found ? 'none' : 'block';
        hiddenOnNoResultElements.forEach(function(element) {
            element.style.display = found ? '' : 'none';
        });
    });
});