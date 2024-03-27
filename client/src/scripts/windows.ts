const loadinScreen = document.getElementById('loading-screen')!;

window.addEventListener('DOMContentLoaded', () => {

  if (loadinScreen) {
    
    window.addEventListener('load', function() {
      loadinScreen.style.display = 'none';
    });
    
    window.addEventListener('beforeunload', function() {
      loadinScreen.style.display = 'flex';
    });
  }

});