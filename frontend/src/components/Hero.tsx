import { useState, useEffect } from "react";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: "/images/1.jpg",
      caption: "Khám phá kho sách hay – phong phú mọi thể loại",
    },
    {
      src: "/images/2.jpg",
      caption: "Sách mới mỗi ngày – kiến thức là sức mạnh",
    },
    {
      src: "/images/3.jpg",
      caption: "Bookstore của Nhân Tuấn – đọc sách theo cách của bạn",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[550px] w-full">
        <div
          className="flex transition-transform duration-[1200ms] ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg">
                  {item.caption}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={goPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg"
      >
        &lt;
      </button>

      {/* Next Button */}
      <button
        onClick={goNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-lg"
      >
        &gt;
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-3 rounded-full cursor-pointer transition-all ${currentIndex === i ? "w-8 bg-green-500" : "w-3 bg-white/70"
              }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
