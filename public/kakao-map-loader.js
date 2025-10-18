// Kakao Map API Loader
window.initKakaoMap = function(appKey) {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao.maps);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          resolve(window.kakao.maps);
        });
      } else {
        reject(new Error('Kakao Map failed to load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Kakao Map script'));
    document.head.appendChild(script);
  });
};
