import React from 'react';

const PdfViewer = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms of Service</h1>
        <div className="text-lg text-gray-700">
          {/* Placeholder for other content */}
        </div>
        <div className="mt-6">
          <iframe
            src={"https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/PulseZest-Course-Agreement%2FPulsezest%20Agreement%20(1).pdf?alt=media&token=06caddff-f0d2-46f2-b1f7-b45985215ab4"}
            width="100%"
            height="500px"
            style={{ border: 'none' }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
