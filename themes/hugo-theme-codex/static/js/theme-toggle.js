// Dark theme toggle functionality
(function() {
  const storageKey = 'theme-preference';
  
  const getColorPreference = () => {
    if (localStorage.getItem(storageKey)) {
      return localStorage.getItem(storageKey);
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  };
  
  const setPreference = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
  };
  
  const reflectPreference = () => {
    document.documentElement.setAttribute('data-theme', theme.value);
    
    const checkbox = document.querySelector('#theme-toggle-checkbox');
    if (checkbox) {
      checkbox.checked = theme.value === 'dark';
    }
  };
  
  const theme = {
    value: getColorPreference(),
  };
  
  // Set early so no page flashes
  reflectPreference();
  
  window.addEventListener('load', () => {
    // Set on load so screen readers can see the latest value
    reflectPreference();
    
    // Attach toggle listener
    const checkbox = document.querySelector('#theme-toggle-checkbox');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        theme.value = checkbox.checked ? 'dark' : 'light';
        setPreference();
      });
    }
  });
  
  // Sync with system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({matches:isDark}) => {
    theme.value = isDark ? 'dark' : 'light';
    setPreference();
  });
})();
