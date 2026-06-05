// Alert.jsx
import React from "react";

export const Alert = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 top-0 left-0 w-full flex justify-center z-50 mt-4 pointer-events-none">
            <div 
                className=" text-white w-[500px] h-[150px] flex flex-col pointer-events-auto"   
            >
                <div className="flex flex-row w-[500px] h-[20px] shadow-lg">
                    <div className="w-[20px] bg-transparent"></div>
                    <div className="w-[460px] bg-alch-cream"></div>
                    <div className="w-[20px] bg-transparent"></div>
                </div>
                <div className="bg-alch-cream h-[110px] w-[500px] shadow-lg">
                    <p className="font-sans font-bold text-base">{message}</p>
                    <button
                        className="bg-alch-cream text-alch-red px-4 py-1 font-bold"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
                <div className="flex flex-row w-[500px] h-[20px]">
                    <div className="w-[20px] bg-transparent"></div>
                    <div className="w-[460px] bg-alch-cream shadow-lg"></div>
                    <div className="w-[20px] bg-transparent"></div>
                </div>
            </div>
        </div>
    );
};
