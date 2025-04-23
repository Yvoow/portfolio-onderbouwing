// function setActiveLink() {
//   const path = window.location.pathname;
//   const pageName = path === '/' ? 'index' : path.split('/').pop().split('.').shift();
//   const links = document.querySelectorAll('.side-bar a[data-page]');
//   links.forEach(link => {
//     link.classList.remove('active');
//   });
//   links.forEach(link => {
//     if (link.getAttribute('data-page') === pageName) {
//       link.classList.add('active');

//       if (pageName === 'persons' || pageName === 'reports' || pageName === 'vehicles') {
//         const dropdownId = 'dropdown2'; 
//         const dropdownArrowId = 'arrow2'; 
//         const dropdown = document.getElementById(dropdownId);
//         const dropdownArrow = document.getElementById(dropdownArrowId);
//         dropdown.classList.add('show');
//         dropdownArrow.classList.remove('fa-chevron-down');
//         dropdownArrow.classList.add('fa-chevron-up');
//       }
//     }
//   });
// }

// function loadPart(selector, filename) {
//   fetch(filename)
//     .then(response => {
//       if (response.ok) {
//         return response.text();
//       } else {
//         throw new Error('Could not load ' + filename);
//       }
//     })
//     .then(html => {
//       document.querySelector(selector).innerHTML = html;
//       setActiveLink();
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }

// window.onload = function () {
//   loadPart('#sidebar', '/pages/main/sidebar.php');
// };

document.addEventListener('DOMContentLoaded', function() {
  var dropdowns = document.getElementsByClassName('dropdown');
  Array.from(dropdowns).forEach(function(dropdown) {
      var dropdownContent = dropdown.querySelector('.dropdown-content');
      var isActiveInside = dropdownContent.querySelector('.active');
      if (isActiveInside) {
          toggleDropdown(dropdownContent.id, dropdown.querySelector('.dropdown-arrow').id);
      }
  });
});

function toggleDropdown(dropdownId, arrowId) {
  var dropdown = document.getElementById(dropdownId);
  var arrow = document.getElementById(arrowId);
  dropdown.classList.toggle('show');
  arrow.classList.toggle('fa-chevron-up');
  arrow.classList.toggle('fa-chevron-down');
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName('dropdown-content');
      Array.from(dropdowns).forEach(function(openDropdown) {
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
              var dropdownArrow = openDropdown.previousElementSibling.querySelector('.dropdown-arrow');
              dropdownArrow.classList.remove('fa-chevron-up');
              dropdownArrow.classList.add('fa-chevron-down');
          }
      });
  }
};
