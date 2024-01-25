// for showing the toggle list
let isActive = false;
function toggle() {
  if (isActive) {
    document.querySelector('.toggle-bar').className = 'toggle-bar'
    document.querySelector('.navigation-mobile-list').className = 'navigation-mobile-list';
    isActive = false;
  } else {
    document.querySelector('.toggle-bar').className = 'toggle-bar active'
    document.querySelector('.navigation-mobile-list').className = 'navigation-mobile-list active';
    isActive = true;
  }
}

//for hiding the toggle list 
window.addEventListener('scroll', function hideNavigation() {
  if (isActive) {
    document.querySelector('.toggle-bar').classList.remove('active')
    document.querySelector('.navigation-mobile-list').classList.remove('active');
  }
})
const search = new URLSearchParams(window.location.search).get('search')
if(search){
  document.querySelector('input[name=search]').value = search
}
