// Force cache clear for consciousness interface
if (performance.navigation.type !== 1) {
  const timestamp = Date.now();
  if (!sessionStorage.getItem('cache-cleared-' + timestamp.toString().slice(0, -3))) {
    sessionStorage.setItem('cache-cleared-' + timestamp.toString().slice(0, -3), 'true');
    window.location.reload(true);
  }
}