// src/components/landingPage/Pixel.js

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Using the custom axios instance
    import lotus from "../../assets/lotus.svg"
    import flower from "../../assets/heading-icon-red.svg"
    import "../media.css";
    import DecorativeButton from "../AuthPage/DecoratedButton";


    export function Pixel() {
        const token = localStorage.getItem("access"); // check login
        const columns = 36;
        const rows = 17;
        const [highlight, setHighlight] = useState([]);
        const [animationdone, setAnimationdone] = useState(false);
        const [animationstart, setAnimationstart] = useState(false);
        const [yourturn, setYourturn] = useState(false);
        const [animation1, setAnimation1] = useState(false);

        const animation2 = [{row: 7, col: 18},{row: 9, col: 18},{row: 8, col: 17},{row: 8, col: 19}];
        const animation3 = [];

        const row1 = 8;
        const col1 = 17;
        for(let i = 1; i < 5; i++){
            for(let j = 0; j < 3; j++){
                const r1 = row1 - i;//for left
                const r2 = row1 + i;//for left
                const c1 = col1 - i - j;//for left

                const r3 = row1 - 1 - i - j;// for top
                const c2 = col1 + 1 - i;//for top
                const c3 = col1 + 1 + i;//for top

                if(r1 >= 0 && r1 < rows && r2 >= 0 && r2 < rows && c1 >= 0 && c1 < columns){
                    animation2.push({row: r1, col: c1});//left
                    animation2.push({row: r2, col: c1});//left
                    animation2.push({row: r3, col: c2});//top
                    animation2.push({row: r3, col: c3});//top
                    animation2.push({row: 16 - r1, col: 36 - c1});//right
                    animation2.push({row: 16 - r2, col: 36 - c1});//right
                    animation2.push({row: 16 - r3, col: 36 - c2});//bottom
                    animation2.push({row: 16 - r3, col: 36 - c3});//bottom
                }
            }
        }

        const animation3Part0 = [{row: 5, col: 15}, {row: 5, col: 20}];

        const animation3Part1 = [{row: 6, col: 13}, {row: 6, col: 22}];

        const animation3Part2 = [];

        for (let i = 0; i < 4; i++) {
            let j = 2*(i) + 1;
            //let k = j/2 + 1;
            while(j){
                animation3Part2.push({row: 9 + j -(i + 1), col: 14 + i});
                animation3Part2.push({row: 9 + j -(i + 1), col: 35 - 14 - i});
                animation3Part1.push({row: 7 + j -(i + 1), col:  7 + i});
                animation3Part1.push({row: 7 + j -(i + 1), col:  35 - 7 - i});
                if(i === 3){
                    animation3Part1.push({row: 4 + j - 1, col: 11});
                    animation3Part1.push({row: 4 + j - 1, col: 35 - 11});
                }

                if(i === 2){
                    animation3Part1.push({row: 5 + j - 1, col: 12});
                    animation3Part1.push({row: 5 + j - 1, col: 35 - 12});
                }

                if ( j - i - 2 < 0 ){
                    let k = j;
                    animation3Part0.push({row: 3 + k -(i + 1), col: 14 + i})
                    animation3Part0.push({row: 3 + k -(i + 1), col: 35 - 14 - i})
                    animation3Part0.push({row: 4, col: 14 + i})
                    animation3Part0.push({row: 4, col: 21 - i})
                }
                j--;
            }
        }

        const animation3Part3 = [{row: 11, col: 13}, {row: 14, col: 16},{row: 11, col: 22}, {row: 14, col: 19},  ]

        const skip = [
            [0,0], [0,5], [4,0], [4,4], [4,5]
        ];

        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 6; j++) {
                if (!skip.some(([x, y]) => x === i && y === j)) {
                    animation3Part3.push({ row: 16 - i, col: 10 + j });
                    animation3Part3.push({ row: 16 - i, col: 35 - 10 - j });
                }
            }
        }

        animation3.push(...animation3Part3, ...animation3Part2, ...animation3Part1, ...animation3Part0);

    useEffect(() => {
        if (token) {
            axiosInstance.get("/profile/")
                .then(res => {
                    if (res.data && res.data.pixel_highlight) {
                        const highlights = res.data.pixel_highlight;
                        setHighlight(highlights);

                        // 👇 If no highlight submitted, start animation1
                        if (highlights.length === 0) {
                            setAnimation1(true);
                        } else {
                            setAnimation1(false);
                        }
                    } else {
                        // 👇 No pixel_highlight in response
                        setAnimation1(true);
                    }
                })
                .catch(err => {
                    console.error("Profile fetch error:", err);
                    // Optional: default animation in case of error
                    setAnimation1(true);
                });
        } else {
            // 👇 User not logged in — show animation
            setAnimation1(true);
        }
    }, [token]);

    
    // --- All grid and styling definitions are unchanged ---
    const customTransparent1 = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 4, col: 0 }, { row: 4, col: 1 }, { row: 5, col: 0 }];
    const customwight1 = [{ row: 0, col: 2 }, { row: 1, col: 3 }, { row: 2, col: 4 }, { row: 3, col: 3 }, { row: 4, col: 2 }, { row: 5, col: 1 }, { row:6 , col: 0 }];
    const customTransparent2 = customTransparent1.map(cell => ({ row: cell.row, col: 35 - cell.col }));
    const customwight2 = customwight1.map(cell => ({ row: cell.row, col: 35 - cell.col }));
    const customTransparent3 = customTransparent1.map(cell => ({ row: 16 - cell.row, col: cell.col }));
    const customwight3 = customwight1.map(cell => ({ row: 16 - cell.row, col: cell.col }));
    const customTransparent4 = customTransparent1.map(cell => ({ row: 16 - cell.row, col: 35 - cell.col }));
    const customwight4 = customwight1.map(cell => ({ row: 16 - cell.row, col: 35 - cell.col }));
    const transperent = [...customTransparent1, ...customTransparent2, ...customTransparent3, ...customTransparent4];
    const wight = [...customwight1, ...customwight2, ...customwight3, ...customwight4];
    const leftbox = [];
    const bottombox = [];

    for (let i = 0; i <= 35; i++) {
        if (i <= 16) {
            // Left vertical border
            leftbox.push({ row: i, col: 0 });
        }
        // Bottom horizontal border
        bottombox.push({ row: 16, col: i });
    }

    // --- End of styling definitions ---

        const handleclick = (row, col) => {
            if (animationdone){
                const isTransparent = transperent.some(h => h.row === row && h.col === col);
                const isWhite = wight.some(h => h.row === row && h.col === col);

                if (isTransparent || isWhite) {
                    // Do nothing if cell is transparent or white
                    return;
                }
                const exist = highlight.some(h => h.row === row && h.col === col);
                console.log({row, col});
                if(exist){
                    setHighlight(highlight.filter(h => !(h.row === row && h.col === col)));
                }else{
                    setHighlight([...highlight, {row, col}]);
                }
            }
        }
    

    const grid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: columns }, (_, c) => ({ row: r, col: c }))
    );

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

        async function animation(){
            setHighlight([]);
            setAnimation1(true);
            await wait(1500);
            setAnimationstart(true);
            setAnimation1(false);
            setHighlight(animation2);
            await wait(1500);
            setHighlight(animation3);
            await wait(1500);
            setHighlight([]);
            setYourturn(true);
            await wait(1500);
            setYourturn(false);
            setAnimationdone(true);
        }

    const submit = async () => {
        if (!token) {
            window.location.href = '/login';
        } else {
            if (highlight.length === 0) {
                alert("Play the game before submitting");
            } else {
                try {
                    const res = await axiosInstance.post("/auth/complete-profile/", { // Using updated axios instance
                        pixel_highlight: highlight
                    });
                    console.log("Your response has been submitted", highlight);
                    console.log("Updated profile from backend:", res.data);
                    alert("Your response has been submitted");
                    setHighlight([]);
                    }catch(err){
                        console.error("save error:", err);
                        alert("failed to save highlights");
                    }
                }
            }
        }

        return (
            <div 
                className="h-auto lg:h-[780px] w-100% bg-alch-dark flex flex-col justify-between items-center pixelbg"   
            >
                    <div className="flex justify-center items-center mt-[66px] lg:mt-[166px] w-[100%]">
                        <div className="flex flex-1 items-center">
                            {/* Left strip */}
                            <div className="lg:flex flex-col w-[5px] hidden">
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[40.08px] lg:h-[120px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                            </div>

                            {/* Middle column */}
                            <div className="lg:flex flex-col w-[20.58px] hidden">
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[26.72px] lg:h-[80px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                            </div>

                            {/* Right big block */}
                            <div className="flex flex-col flex-1">
                                <div className="h-[6.68px] lg:h-[20px] w-[40%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%]  bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[40%]  bg-[rgba(238,236,217,1)]"></div>
                            </div>
                        </div>

                        <div
                            className="-mx-[30px] z-10 relative pixel-grid"
                        >
                            {animation1 && (
                                <img src={lotus} alt="lotus" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full lg:h-[254px] lg:w-[373px]"/>
                            )}

                            {grid.flat().map(({ row, col }) => (
                                <div
                                    key={`${row}-${col}`}
                                    style={{
                                        //border: "1px solid #000",
                                        borderTop: transperent.some(h => h.row === row && h.col === col) || 
                                                wight.some(h => h.row === row && h.col === col)
                                                ? "none"
                                                : "0.1px solid rgba(238, 236, 217, 1)",
                                        borderRight: transperent.some(h => h.row === row && h.col === col) || 
                                                    wight.some(h => h.row === row && h.col === col)
                                                    ? "none"
                                                    : "0.1px solid rgba(238, 236, 217, 1)",
                                        borderBottom: transperent.some(h => h.row === row && h.col === col) || 
                                                        wight.some(h => h.row === row && h.col === col)
                                                        ? "none"
                                                        :bottombox.some(h => h.row === row && h.col === col)
                                                        ? "0.1px solid rgba(238, 236, 217, 1)"
                                                        : "none",
                                        borderLeft: transperent.some(h => h.row === row && h.col === col) || 
                                                        wight.some(h => h.row === row && h.col === col)
                                                        ? "none"
                                                        :leftbox.some(h => h.row === row && h.col === col)
                                                        ? "0.1px solid rgba(238, 236, 217, 1)"
                                                        : "none",
                                        backgroundColor: transperent.some(h => h.row === row && h.col === col)
                                                ? "transparent"
                                                :wight.some(h => h.row === row && h.col === col)
                                                ?"rgba(238, 236, 217, 1)"
                                                :highlight.some(h => h.row === row && h.col === col)
                                                ? "rgba(239,82,67,1)"
                                                : "rgba(44, 44, 44, 1)",
                                    }}
                                    onClick={()=>{handleclick(row, col)}}
                                />
                            ))}
                            
                            {( yourturn &&
                                <div className="flex justify-center items-center gap-[10px] absolute  w-full h-full text-[#EF5243] text-center font-display text-[16px]  lg:text-[60px] font-extrabold">
                                    <img className="w-[10px] lg:w-[30px]" src={flower} alt="flower"/>
                                    <p className="" >Now it’s your turn</p>
                                    <img className="w-[10px] lg:w-[30px]" src={flower} alt="flower"/>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-1 items-center">
                            {/* right strip */}
                            <div className="flex flex-col items-end flex-1">
                                <div className="h-[6.68px] lg:h-[20px] w-[40%]  bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[100%] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[6.68px] lg:h-[20px] lg:w-[20.58px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] w-[40%] bg-[rgba(238,236,217,1)]"></div>
                            </div>

                            {/* Middle column */}
                            <div className="lg:flex flex-col w-[20.58px] hidden">
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[26.72px] lg:h-[80px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                            </div>

                            {/* left big block */}
                            <div className="lg:flex flex-col w-[5px] hidden">
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[40.08px] lg:h-[120px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                                <div className="h-[10.02px] lg:h-[30px] bg-transparent"></div>
                                <div className="h-[6.68px] lg:h-[20px] bg-[rgba(238,236,217,1)]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[46px] mt-[10px] lg:mt-[50px] flex justify-center items-center">
                        <div className="relative h-[46px] mt-[10px] lg:mt-[50px] flex justify-center items-center">

                   {/* Explore button */}
                   <div
                     className={`absolute transition-opacity duration-500 ${
                       animationstart ? "opacity-0 pointer-events-none" : "opacity-100"
                     } lg:w-[200px] w-[80px] h-[30px] lg:h-[46px] flex justify-center items-center`}
                   >
                     <DecorativeButton
                       className="w-full h-full font-sans font-bold lg:text-base text-[6.8px] lg:text-[15px]"
                       onClick={animation}
                     >
                       Explore the Fun 
                     </DecorativeButton>
                   </div>
                 
                   {/* Submit button */}
                   <div
                     className={`absolute transition-opacity duration-500 ${
                       animationdone ? "opacity-100" : "opacity-0 pointer-events-none"
                     } lg:w-[116.29px] w-[50px] h-[19px] lg:h-[46px] flex justify-center items-center`}
                   >
                     <DecorativeButton
                       className="w-full h-full font-sans font-bold text-[8px] lg:text-[15px] lg:text-base"
                       onClick={submit}
                     >
                       Submit
                     </DecorativeButton>
                   </div>
                 
                 </div>

                    </div>
                    <img className="w-[100%] h-[10.94px] lg:h-[40px] mt-[47px] lg:mt-auto" src="/image131.png" alt="image131"/>
            </div>
    );
}