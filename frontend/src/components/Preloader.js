import { useEffect, useState } from 'react';
import backgroundPattern from '../assets/brightbg.svg';
import topBorder from '../assets/top-border.svg';

const Preloader = () => {
  const preloaderStyle = {
    backgroundImage: `url(${backgroundPattern})`,
    backgroundRepeat: 'repeat-y',
    backgroundSize: "100% auto",
    backgroundPosition: 'center',
  };

  const [timeLeft, setTimeLeft] = useState(1.1); // seconds
  const [heightPercent, setHeightPercent] = useState(100); // percentage

  useEffect(() => {
    const delay = 500; // 0.5s delay
    const duration = 1100; // 1.1s shrinking animation
    let animationFrame;

    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const update = () => {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(duration - elapsed, 0);

        setTimeLeft(remaining / 1000);
        setHeightPercent((remaining / duration) * 100);

        if (remaining > 0) {
          animationFrame = requestAnimationFrame(update);
        }
      };

      animationFrame = requestAnimationFrame(update);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, []); // empty dependency array so it runs once


  return (
    <div className='fixed inset-0 z-50 h-[100%] w-[100%]'>
      <div className='h-[100%] w-[100%] relative'>
        <div
          className="shrinking-div absolute bottom-0 right-0 flex flex-col justify-start overflow-hidden bg-alch-cream w-full"
          style={{
            ...preloaderStyle,
            height: `${heightPercent}%`,
          }}
        >
          <div className="z-10 flex justify-between">
            <div>
              <div className="h-[3px] w-[10px] lg:h-[10px] lg:w-[24px] bg-alch-dark"></div>
              <div className="h-[3px] w-[6px] lg:h-[10px] lg:w-[16px] bg-alch-dark"></div>
              <div className="h-[3px] w-[3px] lg:h-[10px] lg:w-[8px] bg-alch-dark"></div>
            </div>
            <div className="items-end flex flex-col">
              <div className="h-[3px] w-[10px] lg:h-[10px] lg:w-[24px] bg-alch-dark"></div>
              <div className="h-[3px] w-[6px] lg:h-[10px] lg:w-[16px] bg-alch-dark"></div>
              <div className="h-[3px] w-[3px] lg:h-[10px] lg:w-[8px] bg-alch-dark"></div>
            </div>
          </div>
          <img src={topBorder} alt="Decorative Top Border" className="w-full top-0 left-0" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
