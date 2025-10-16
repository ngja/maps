// Naver Maps API Loader
window.initNaverMaps = function(clientId) {
  return new Promise((resolve, reject) => {
    if (window.naver && window.naver.maps) {
      resolve(window.naver.maps);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => {
      if (window.naver && window.naver.maps) {
        resolve(window.naver.maps);
      } else {
        reject(new Error('Naver Maps failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Naver Maps script'));
    document.head.appendChild(script);
  });
};
