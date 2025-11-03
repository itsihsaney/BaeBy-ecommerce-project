import React, { useEffect, useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function GenzPicks() {
  const [picks, setPicks] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
 

  useEffect(() => {
    fetch("http://localhost:5001/genz-picks")
      .then((res) => res.json())
      .then((data) => setPicks(data))
      .catch((err) => console.error("Error fetching GenZ Picks:", err));
  }, []);

  // Scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -window.innerWidth, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: window.innerWidth, behavior: "smooth" });
  };

  // Navigate to product details
  const handleViewDetails = (item) => {
    navigate(`/product/${item.id}`);
  };

  

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Scrollable Banners */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {picks.map((item) => (
          <div
            key={item.id}
            className="relative flex-shrink-0 w-full h-full snap-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white">
              <div className="flex gap-4">
                {/* 👕 Go to Product Details */}
                <button
                  onClick={() => handleViewDetails(item)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition"
                >
                  Cop the Drip
                </button>

                {/* 💖 Add to Wishlist */}
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-gray-800 p-3 rounded-full backdrop-blur-md"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={scrollRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-gray-800 p-3 rounded-full backdrop-blur-md"
      >
        <FaChevronRight size={20} />
      </button>
    </div>
  );
}

export default GenzPicks;
