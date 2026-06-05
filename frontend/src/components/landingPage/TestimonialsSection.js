import { motion, useMotionValue } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useState, useRef, useCallback, useEffect, forwardRef } from "react";

import headingIconRed from "../../assets/heading-icon-red.svg";
import quoteIcon from "../../assets/quote-icon.svg";
import slideBarLeftDeco from "../../assets/slide-bar-leftdeco.svg";
import testimonialCardFrame from "../../assets/testimonial-card-frame2.svg";
import starFilled from "../../assets/star-filled.svg";
import starEmpty from "../../assets/star-empty.svg";
import authorPlaceholder from "../../assets/author-placeholder.png";

const testimonials = [
  { name: "Akshat Jain", title: "(Senior developer)", rating: 4, text: "Alcheringa wasn’t just a fest, it was a fever dream that I’m still not over. It was like vibing at a concert." },
  { name: "Annu Kumari", title: "(Frontend developer)", rating: 3, text: "If happiness had a postcode, it would be Alcheringa." },
  { name: "Amaan Farooq", title: "(Backend developer)", rating: 4, text: "Still trying to recover from the emotional damage Alcheringa caused — in the best way possible." },
  { name: "Rohit", title: "(CSS expert)", rating: 5, text: "There’s fun, and then there’s Alcheringa-level fun." },
  { name: "Silpi Bora", title: "(Frontend developer)", rating: 5, text: "If you ever need a break from reality, just attend Alcheringa." },
  { name: "Khyati Arora", title: "(Frontend developer)", rating: 3, text: "Decent experience overall. Could be improved but still valuable." },
];

const TestimonialCard = ({ name, title, rating, text }) => (
  <div className="flex flex-col w-[309px] flex-shrink-0">
    <div
      className="flex flex-col h-[303px]"
      style={{
        backgroundImage: `url(${testimonialCardFrame})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col flex-grow px-8 pt-8 pb-14">
        <p className="flex-grow text-alch-dark">{text}</p>
        <div className="flex items-center mt-4">
          {[...Array(6)].map((_, i) => (
            <img key={i} src={i < rating ? starFilled : starEmpty} alt="star" className="h-5 w-5 mr-1 mb-2" />
          ))}
        </div>
      </div>
    </div>
    <div className="flex items-center pt-1">
      <img src={authorPlaceholder} alt={name} className="h-12 w-12 mr-4" />
      <div>
        <p className="font-bold text-alch-dark">{name}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  </div>
);

const TestimonialsSection = forwardRef((props, ref) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const thumbMotionX = useMotionValue(0);
  const trackWidth = 272;
  const thumbWidth = 68;
  const maxDragX = trackWidth - thumbWidth;

  const handleSlideChange = useCallback((swiper) => {
    const progress = swiper.progress * 100;
    const clampedProgress = Math.max(0, Math.min(100, progress));
    setScrollProgress(clampedProgress);
    if (!isDragging) {
      const newX = (clampedProgress / 100) * maxDragX;
      thumbMotionX.set(newX);
    }
  }, [isDragging, maxDragX, thumbMotionX]);

  const handleTrackClick = useCallback((event) => {
    if (!swiperInstance || !constraintsRef.current) return;
    const trackRect = constraintsRef.current.getBoundingClientRect();
    const clickX = event.clientX - trackRect.left - (thumbWidth / 2);
    const newX = Math.max(0, Math.min(maxDragX, clickX));
    const newProgress = newX / maxDragX;
    swiperInstance.setProgress(newProgress, 300);
  }, [swiperInstance, maxDragX, thumbWidth]);

  const handleThumbDrag = useCallback((event, info) => {
    if (!swiperInstance) return;
    const newX = Math.max(0, Math.min(maxDragX, info.point.x));
    const newProgress = newX / maxDragX;
    swiperInstance.setProgress(newProgress, 0);
    thumbMotionX.set(newX);
  }, [swiperInstance, maxDragX, thumbMotionX]);

  const handleThumbDragStart = () => setIsDragging(true);
  const handleThumbDragEnd = () => setIsDragging(false);

  useEffect(() => {
    if (!isDragging) {
      const newX = (scrollProgress / 100) * maxDragX;
      thumbMotionX.set(newX);
    }
  }, [scrollProgress, isDragging, maxDragX, thumbMotionX]);

  // ✅ New scroll functions for left/right buttons
  const scrollLeft = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };
  const scrollRight = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  return (
    <section ref={ref} className="py-16 bg-transparent">
      <div className="w-full">
        <h2 className="flex items-center justify-center text-center font-display text-[30px] lg:text-[48px] font-extrabold text-alch-dark mb-16">
          <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6 mx-2" />
          TESTIMONIALS
          <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6 mx-2" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pl-4 sm:pl-8">
          {/* Left static section */}
          <div className="text-alch-dark text-center lg:text-left">
            <img src={quoteIcon} alt="Quote" className="h-[38.12px] lg:h-16 mx-auto lg:mx-0" />
            <h3 className="text-[20px] lg:text-3xl font-bold mt-4 leading-snug w-full max-w-[272px] mx-auto lg:mx-0 text-left">
              What our previous<br /> Participants are<br /> saying
            </h3>
            <div className="mt-10 flex items-center justify-center lg:justify-start space-x-2">
              {/* ✅ Left click → scroll left */}
              <img
                src={slideBarLeftDeco}
                alt="Left Deco"
                className="w-6 h-6 cursor-pointer"
                onClick={scrollLeft}
              />
              <div
                ref={constraintsRef}
                className="relative h-[20px] cursor-pointer group"
                style={{ width: `${trackWidth}px`, background: 'linear-gradient(90deg, #FED4A8 -25.55%, #FFB261 125%)' }}
                onClick={handleTrackClick}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-[#FFB261]"
                  style={{ width: `${thumbWidth}px`, x: thumbMotionX }}
                  drag="x"
                  dragConstraints={constraintsRef}
                  dragElastic={0}
                  dragMomentum={false}
                  onDragStart={handleThumbDragStart}
                  onDrag={handleThumbDrag}
                  onDragEnd={handleThumbDragEnd}
                />
              </div>
              {/* ✅ Right click → scroll right */}
              <img
                src={slideBarLeftDeco}
                alt="Right Deco"
                className="w-6 h-6 scale-x-[-1] cursor-pointer"
                onClick={scrollRight}
              />
            </div>
          </div>

          {/* Swiper section */}
          <div className="lg:col-span-2 overflow-hidden">
            <Swiper
              onSwiper={setSwiperInstance}
              onSlideChange={handleSlideChange}
              onProgress={handleSlideChange}
              slidesPerView={'auto'}
              spaceBetween={24}
              className="w-full"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="!w-auto h-auto">
                  <TestimonialCard {...testimonial} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TestimonialsSection;
