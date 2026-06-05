import React from 'react';
import logo from "../../assets/logo.svg";
import phone from "../../assets/phonecall.svg";
import "../media.css";

export function Footer({ scrollToFAQ, scrollToTestimonials, scrollToComp , ref }){
    return(
        <div className="h-[890px] bg-transparent flex flex-col" ref={ref}>
            
            <img className="w-[94%] h-auto mb-[3px] lg:mb-[5px] self-center mt-[40px] lg:mt-[80px]" src="/blackfooter.png" alt="blackbar"/>
            <div className="-mb-[9px] lg:-mb-[30px] z-10 flex justify-between">
                <div>
                    <div className="h-[3px] w-[10px] lg:h-[10px] lg:w-[24px] bg-alch-cream"></div>
                    <div className="h-[3px] w-[6px] lg:h-[10px] lg:w-[16px] bg-alch-cream"></div>
                    <div className="h-[3px] w-[3px] lg:h-[10px] lg:w-[8px] bg-alch-cream"></div>
                </div>
                <div className="items-end flex flex-col">
                    <div className="h-[3px] w-[10px] lg:h-[10px] lg:w-[24px] bg-alch-cream"></div>
                    <div className="h-[3px] w-[6px] lg:h-[10px] lg:w-[16px] bg-alch-cream"></div>
                    <div className="h-[3px] w-[3px] lg:h-[10px] lg:w-[8px] bg-alch-cream"></div>
                </div>
            </div>
            <div 
                className="w-full flex-grow bg-alch-dark pixelbg"
            >
                <div
                    className="w-full h-full flex flex-col"
                >
                    <div className="flex flex-col lg:flex-row w-full items-center gap-[75px] justify-around lg:items-start lg:gap-0 mt-[20px] lg:mt-[112px]">
                        <div className=' w-auto flex flex-col items-center lg:items-start'>
                            <div>
                                    <div className='flex flex-row justify-center items-center gap-[10px] h-[69px]'>
                                        <img className="w-[37.99px] h-[43.71px]" src={logo} alt="logo"/>
                                        <div className='text-alch-cream  h-[65.83px] flex flex-col justify-center'>
                                            <p className='font-display font-bold text-[37.99px] h-[42px] leading-none'>ALCHERINGA</p>
                                            <p className='font-sans h-[27px]  font-normal text-[18.99px] leading-none self-end'>IIT GUWAHATI</p>
                                        </div>
                                    </div>    
                            </div>  
                            <div className="  h-[40px] justify-between flex gap-4 mt-[59px]">
                                <a href="https://www.instagram.com/alcheringaiitg/" target="_blank" rel="noopener noreferrer">
                                    <img className='w-[41px] h-[34.17px]  lg:w-[48px] lg:h-[40px] cursor-pointer' src="/insta.png" alt="instagram"  />
                                </a>
   
                                <a href="https://www.youtube.com/@alcheringaIITG/featured" target="_blank" rel="noopener noreferrer">
                                    <img className='w-[41px] h-[34.17px]  lg:w-[48px] lg:h-[40px] cursor-pointer' src="/youtube.png" alt="youtube"  />
                                </a>

                                <a href="https://in.linkedin.com/company/alcheringaiitguwahati" target="_blank" rel="noopener noreferrer">
                                    <img className='w-[41px] h-[34.17px]  lg:w-[48px] lg:h-[40px] cursor-pointer' src="/linkedin.png" alt="linkedin"  />
                                </a>

                                <a href="https://x.com/alcheringaiitg" target="_blank" rel="noopener noreferrer">
                                    <img className='w-[41px] h-[34.17px]  lg:w-[48px] lg:h-[40px] cursor-pointer' src="/x.png" alt="X"  />
                                </a>
   
                            </div>  
                        </div> 
                        <div className="text-alch-cream text-center lg:text-left w-[200px]">
                            <h1 className="h-[35] font-medium text-[32px] leading-[110.00000000000001%] tracking-[0.05em] mb-[24px] lg:mb-[10px]">LINKS</h1>
                            <ul className="h-[95px] font-bold text-sm leading-[140%] tracking-[0.02em]">
                                {/* <button className='mt-[10px] cursor-pointer'>About us</button> */}
                                <button className='mt-[10px] cursor-pointer' onClick={scrollToComp}>Modules and Competitions</button>
                                {/* <button className='mt-[10px] cursor-pointer' onClick={scrollToTestimonials}>Testimonials</button><br/> */}
                                <button className='mt-[10px] cursor-pointer' onClick={scrollToFAQ}>FAQs</button>
                            </ul>
                        </div>
                        <div className="text-alch-cream  w-[304px] flex flex-col items-center lg:items-start gap-[60px] lg:gap-0">
                            <h1 className="h-[35] font-medium text-[32px] leading-[110.00000000000001%] tracking-[0.05em] mb-[18px]">CONTACT US</h1>
                            <div className="text-sm leading-[140%] tracking-[0.02em] flex lg:flex-row flex-col justify-between text-center lg:text-left gap-[50px] lg:gap-[20px]">
                                <ul>
                                    <li className="h-[20px] font-bold mb-[10px]">Shashank Daga</li>
                                    <li className='mb-[10px]'>PR Head</li>
                                    <div className='flex flex-row items-center justify-center lg:justify-start gap-[10px] mb-[10px]'><img className='w-[20px] h-[22.52px]' src={phone} alt='phone'/><li className='inline-block'>+91 8240950055</li></div>
                                    <div className='flex flex-row gap-[10px] items-center justify-center'><li className='inline-block'>shashank.d@alcheringa.co.in</li></div>
                                </ul>
                                <ul>
                                    <li className="h-[20px] font-bold mb-[10px]">Khushi Gupta</li>
                                    <li className='mb-[10px]'>PR Head</li>
                                    <div className='flex flex-row gap-[10px] mb-[10px] items-center lg:justify-start justify-center'><img className='w-[20px] h-[22.52px]' src={phone} alt='phone'/><li className='inline-block'>+91 9864875424</li></div>
                                    <div className='flex flex-row gap-[10px] items-center justify-center'><li className='inline-block'>khushi.g@alcheringa.co.in</li></div>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ===== START: NEW FLOWER ANIMATION ===== */}

                    {/* This main container hides the scrolling overflow */}
                    <div className='w-full overflow-hidden'>

                        {/* --- DESKTOP ANIMATION --- */}
                        {/* Uses your new desktop-row-1.png and desktop-row-2.png */}
                        <div className='hidden md:block mt-[105px] w-full mx-auto'>
                            {/* Row 1: Scrolls RIGHT */}
                            <div className="w-[200%] flex animate-scroll-right">
                                {/* Two copies of the image for a seamless loop */}
                                <img className="w-[50%] h-[97.5px] object-cover" src="/desktop-row-1.png" alt="footer row 1"/>
                                <img className="w-[50%] h-[97.5px] object-cover" src="/desktop-row-1.png" alt="footer row 1"/>
                            </div>
                            {/* Row 2: Scrolls LEFT */}
                            <div className="w-[200%] flex animate-scroll-left">
                                <img className="w-[50%] h-[97.5px] object-cover" src="/desktop-row-2.png" alt="footer row 2"/>
                                <img className="w-[50%] h-[97.5px] object-cover" src="/desktop-row-2.png" alt="footer row 2"/>
                            </div>
                        </div>

                        {/* --- MOBILE ANIMATION --- */}
                        {/* Uses your new mobile-row-1.png and mobile-row-2.png */}
                        <div className='block md:hidden mt-[80px] w-full'>
                            {/* Row 1: Scrolls RIGHT */}
                            <div className="w-[200%] flex animate-scroll-right">
                                <img className="w-[50%] h-[42.5px] object-cover" src="/mobile-row-1.png" alt="footer row 1"/>
                                <img className="w-[50%] h-[42.5px] object-cover" src="/mobile-row-1.png" alt="footer row 1"/>
                            </div>
                            {/* Row 2: Scrolls LEFT */}
                            <div className="w-[200%] flex animate-scroll-left">
                                <img className="w-[50%] h-[42.5px] object-cover" src="/mobile-row-2.png" alt="footer row 2"/>
                                <img className="w-[50%] h-[42.5px] object-cover" src="/mobile-row-2.png" alt="footer row 2"/>
                            </div>
                        </div>
                    </div>
                    {/* ===== END: NEW FLOWER ANIMATION ===== */}

                    <div className="text-alch-cream text-[10px] lg:text-sm font-normal tracking-[0.02em] leading-[140%] h-[40px] lg:w-[1293px] w-full lg:ml-[79px] mt-[60px] lg:mb-0 mb-[10px] flex lg:flex-row flex-col justify-between items-center">
                        <a href="https://alcheringa.co.in/" target="_blank" rel="noopener noreferrer" className="text-alch-cream no-underline lg:mb-0 mb-[10px]">
                            Alcheringa @ 2025. All rights reserved.
                        </a>
                        <div className='lg:mb-0 mb-[10px]'>
                            Developed by Team Web Operations
                        </div>
                    </div>
                    <img className="w-full h-auto mt-auto" src="/image131footer.png" alt="image131"/>
                </div>
            </div>
        </div>
    )
}