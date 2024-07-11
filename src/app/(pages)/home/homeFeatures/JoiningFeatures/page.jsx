import React, { useEffect, useRef, useState } from 'react';

const JourneyPage = () => {
  const [showWhiteBackground, setShowWhiteBackground] = useState(false);
  const journeyRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const journey = journeyRef.current;
      const scrollY = window.scrollY;
      const journeyTop = journey.offsetTop;
      const journeyHeight = journey.offsetHeight;

      // Calculate the midpoint of the journey section
      const journeyMidpoint = journeyTop + journeyHeight / 2;

      // Determine if scroll position is past the midpoint
      setShowWhiteBackground(scrollY >= journeyMidpoint);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreNowClick = () => {
    // Adjust these values as needed for different scrolling behavior
    const scrollOptions = {
      top: 700,         // Scroll to the top of the page
      left: 0,        // Scroll horizontally to the leftmost point
      behavior: 'smooth', // Smooth scrolling behavior
    };

    window.scrollTo(scrollOptions);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
      <div ref={journeyRef} className="relative w-full max-w-3xl p-8 bg-black rounded-lg shadow-lg">
        <div className="ml-5 font-bold text-4xl text-center underline">Our Journey</div>
        <br></br>
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>
          <div className="ml-4 font-bold text-lg">5 years Exp</div>
          <div className="flex-1 border-t-2 border-dashed border-gray-600 mx-4"></div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>
          <div className="ml-4 font-bold text-lg">5k Learners</div>
          <div className="flex-1 border-t-2 border-dashed border-gray-600 mx-4"></div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>
          <div className="ml-4 font-bold text-lg">100 Alumni In PulseZest</div>
          <div className="flex-1 border-t-2 border-dashed border-gray-600 mx-4"></div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
          </div>
          <div className="ml-4 font-bold text-lg">10 LPC Ctr</div>
        </div>

        <div className={`mt-8 p-6 ${showWhiteBackground ? 'bg-white text-black' : 'bg-black text-white'} rounded-lg`}>
          <h3 className="text-xl font-bold mb-2">Explore Our Offer</h3>
          <p>Discover our exclusive offers tailored just for you.</p>
          <button onClick={handleExploreNowClick} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none">Explore Now</button>
        </div>
      </div>
    </div>
  );
};

export default JourneyPage;
