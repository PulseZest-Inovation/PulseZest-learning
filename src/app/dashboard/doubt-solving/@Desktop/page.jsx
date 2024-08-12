'use client';

import { useEffect } from 'react';

export default function DesktopDoubtSolving() {
  useEffect(() => {
    // Check if Tawk API is already loaded
    if (typeof window !== 'undefined' && !window.Tawk_API) {
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement('script');
        var s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/6510ab840f2b18434fda5678/1i4cnvv37'; // Replace with your Tawk.to script URL
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-4">
        <h1 className="text-2xl font-semibold mb-4">Doubt Solving Desktop</h1>
        {/* Other content of the component */}
      </div>

      {/* Chat container */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-96 bg-white border rounded-lg shadow-lg overflow-hidden pointer-events-auto">
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-auto">
              {/* Chat area */}
              <div id="tawk-chat-container" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
