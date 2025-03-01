import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchShows } from "../utils/api"; // Adjust path as needed
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ShowCarousel() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    // Fetch the shows when the component mounts
    async function loadShows() {
      try {
        const data = await fetchShows();
        // Optionally, filter or slice to the top N shows if you only want a subset
        setShows(data.slice(0, 10)); 
      } catch (error) {
        console.error("Error fetching shows for carousel:", error);
      }
    }
    loadShows();
  }, []);

  // react-slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Number of slides per view
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // Adjust for smaller screens
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="my-8 mx-auto" style={{ maxWidth: "1200px" }}>
      <h2 className="text-2xl font-bold mb-4">Recommended Shows</h2>
      <Slider {...settings}>
        {shows.map((show) => (
          <div key={show.id} className="p-4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={show.image}
                alt={show.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{show.title}</h3>
                {/* Optionally display description or other info */}
                <p className="text-sm text-gray-600 line-clamp-3">
                  {show.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
