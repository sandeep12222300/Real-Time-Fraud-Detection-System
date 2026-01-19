// api.js - determines API URL and fetches predictions with fallback logic
(function(global){
  function determineApiUrl() {
    try {
      const host = window?.location?.hostname;
      const port = window?.location?.port;
      if ((host === 'localhost' || host === '127.0.0.1') && port === '3000') {
        return 'http://localhost:8082/api/fraud/predictions';
      }
    } catch (e) {}
    return '/api/fraud/predictions';
  }

  const API_URL = determineApiUrl();

  async function fetchPredictions({ signal } = {}) {
    // Try primary URL, then localhost fallback if needed, then local mock file
    const tryFetch = async (url) => {
      const res = await fetch(url, { method: 'GET', signal });
      return res;
    };

    // Primary attempt
    try {
      let res = await tryFetch(API_URL);
      if (res && res.status === 404 && API_URL.startsWith('/api')) {
        // try localhost backend
        try { res = await tryFetch('http://localhost:8082' + API_URL); } catch (e) {}
      }
      if (!res) throw new Error('No response');
      if (!res.ok) throw new Error('API error: ' + res.status+ ' ' + res.statusText);
      const json = await res.json();
      return json;
    } catch (err) {
      // If primary is /api, try http://localhost:8082 prefix
      if (API_URL.startsWith('/api')) {
        try {
          const url = 'http://localhost:8082' + API_URL;
          const res2 = await tryFetch(url);
          if (res2 && res2.ok) return await res2.json();
        } catch (e) {}
      }

      // Finally try local mock data (used for offline/demo)
      try {
        const r = await fetch('mock-data.json');
        if (r && r.ok) return await r.json();
      } catch (e) {}

      throw err;
    }
  }

  global.FraudApi = {
    API_URL,
    fetchPredictions,
  };
})(window);
