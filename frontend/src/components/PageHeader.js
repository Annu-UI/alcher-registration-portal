import React from 'react';
import Logo from './../assets/logo.svg'; // Path from components/ to assets/
//import BannerArrow from './';

const PageHeader = ({ searchTerm, setSearchTerm }) => {
    // Figma Dimensions
    const HEADER_HEIGHT = '120px';

  return (
    <header className="relative w-full" style={{ height: HEADER_HEIGHT }}>
      
      {/* 1. Logo (left: 66px; top: 32px; width: 165.27px; height: 53px;) */}
      <div 
        className="absolute w-[165.27px] h-[53px] flex justify-center items-center z-20"
        style={{ left: '66px', top: '32px' }}
      >
        <Logo className="w-full h-full" />
      </div>

      {/* 2. ALL COMPETITIONS Banner (Centered; top: 31px; width: 560.5px; height: 71px) */}
      <div 
        className="absolute top-[31px] left-1/2 transform -translate-x-1/2 
                   w-[560.5px] h-[71px] bg-black text-white 
                   flex justify-center items-center text-lg font-extrabold tracking-widest 
                   border-t-[10px] border-b-[10px] border-[#171717] z-20"
      > </div> 
        {/* ALL COMPETITIONS
        <BannerArrow className="ml-3 w-5 h-5 fill-orange-400" />
      </div> */}

      {/* 3. Search Bar (left: 1148px; top: 45px; width: 220px; height: 28px) */}
      <div 
        className="absolute w-[220px] h-[28px] bg-[#EEECD9] border border-[#171717] overflow-hidden p-0.5 z-20"
        style={{ left: '1148px', top: '45px' }}
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-full bg-transparent text-[#171717] text-xs font-normal 
                     px-2 focus:outline-none placeholder-[#171717]"
        />
      </div>
    </header>
  );
};

export default PageHeader;
