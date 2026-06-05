// src/components/landingPage/AfterMovieSection.js

import React from 'react';
import { motion } from 'framer-motion';

// Final: Importing all necessary assets for this component
import headingIconRed from '../../assets/heading-icon-red.svg';
import backgroundPattern from '../../assets/background-pattern.svg';
import photoBorderTop from '../../assets/photo-border-top.svg';
import photoBorderBottom from '../../assets/photo-border-bottom.svg';
import photoBorderLeft from '../../assets/photo-border-left.svg';
import photoBorderRight from '../../assets/photo-border-right.svg';

const AfterMovieSection = () => {
  const youtubeVideoId = 'bk3LJ7ECy90';
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`;

  const sectionStyle = {
    background:"transparent",
  };

  return (
    <section className="py-16 px-4 sm:px-8 overflow-hidden" style={sectionStyle}>
      <div className="max-w-7xl mx-auto">
        
        {/* FINAL HEADING: Single, responsive line with red text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center text-center font-display font-extrabold text-alch-dark mb-12"
        >
          <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6" />
          <span className="whitespace-nowrap px-3 font-extrabold text-[25px] lg:text-[48px]">
            CHECK OUT OUR <br className="block lg:hidden" /> ALCHERINGA 24 AFTER<br className="block lg:hidden" /> MOVIE
          </span>
          <img src={headingIconRed} alt="Decorative Icon" className="h-5 sm:h-6" />
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-6xl mx-auto"//width
        >
          {/* FINAL BORDER: Built with 4 positioned divs */}
          <div className="relative p-6"> {/* Padding creates space for the border */}
            
            {/* The video player sits inside the padded area */}
            {/* height */}
            <div className="relative pt-[56.25%] bg-black overflow-hidden">
              <div className='absolute top-0 left-0 z-20 flex flex-col items-start'>
                <div className='w-[30px] h-[10px] bg-alch-cream'></div>
                <div className='w-[20px] h-[10px] bg-alch-cream'></div>
                <div className='w-[10px] h-[10px] bg-alch-cream'></div>
              </div>
              <div className='absolute top-0 right-0 z-20 flex flex-col items-end'>
                <div className='w-[30px] h-[10px] bg-alch-cream'></div>
                <div className='w-[20px] h-[10px] bg-alch-cream'></div>
                <div className='w-[10px] h-[10px] bg-alch-cream'></div>
              </div>
              <div className='absolute bottom-0 left-0 z-20 flex flex-col items-start'>
                <div className='w-[10px] h-[10px] bg-alch-cream'></div>
                <div className='w-[20px] h-[10px] bg-alch-cream'></div>
                <div className='w-[30px] h-[10px] bg-alch-cream'></div>
              </div>
              <div className='absolute bottom-0 right-0 z-20 flex flex-col items-end'>
                <div className='w-[10px] h-[10px] bg-alch-cream'></div>
                <div className='w-[20px] h-[10px] bg-alch-cream'></div>
                <div className='w-[30px] h-[10px] bg-alch-cream'></div>
              </div>
              

              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={youtubeEmbedUrl}
                title="Alcheringa 2024 Aftermovie"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* The four border elements, positioned in the padding area */}
            <div className="absolute top-0 left-4 right-4 h-4 bg-repeat-x" style={{ backgroundImage: `url(${photoBorderTop})`, backgroundSize: 'auto 100%' }}></div>
            <div className="absolute bottom-0 left-4 right-4 h-4 bg-repeat-x" style={{ backgroundImage: `url(${photoBorderBottom})`, backgroundSize: 'auto 100%' }}></div>
            <div className="absolute top-4 bottom-4 left-0 w-4 bg-repeat-y" style={{ backgroundImage: `url(${photoBorderLeft})`, backgroundSize: '100% auto' }}></div>
            <div className="absolute top-4 bottom-4 right-0 w-4 bg-repeat-y" style={{ backgroundImage: `url(${photoBorderRight})`, backgroundSize: '100% auto' }}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AfterMovieSection;