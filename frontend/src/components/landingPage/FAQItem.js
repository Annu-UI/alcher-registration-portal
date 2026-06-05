import { useState } from "react"; // if you use it
import PropTypes from "prop-types";
import ClickSpark from "../../animation/ClickSpark";

export default function FAQItem({ question, answer, index }) {
  const [openIndex, setOpenIndex] = useState([]);

  const invert = (i) => {
    if (openIndex.includes(i)) {
      setOpenIndex(openIndex.filter((x) => x !== i));
    } else {
      setOpenIndex([...openIndex, i]);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="w-[970px] hidden lg:block">
        <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
          <div
            className="w-full lg:h-[60px] h-[81px] flex justify-between items-center"
            style={{
              backgroundImage: "url('/faqbar.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            onClick={() => invert(index)}
          >
            <p className="text-[rgba(238,236,217,1)] ml-[15px] font-bold text-sm tracking-[0.04em] leading-[110%]">
              {question}
            </p>
            <img
              src="/downup.png"
              alt="toggle"
              className={`w-[16px] h-[15px] mr-[20px] cursor-pointer transition-transform duration-500 ${
                openIndex.includes(index) ? "rotate-180" : "rotate-0"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                invert(index);
              }}
            />
          </div>
        </ClickSpark>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            openIndex.includes(index) ? "max-h-[200px] opacity-100 mt-[-12px]" : "max-h-0 opacity-0"
          }`}
          style={{
            backgroundImage: "url('/popfaqbar.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-center items-center h-[99px]">
            <p className="font-normal text-sm tracking-[0.02em] leading-[140%] w-[899px]">{answer}</p>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col items-center">
        <div
          className="w-[340px] h-[75px] max-sm:w-[270px] max-sm:h-[60px] md:w-[65%] md:h-[85px] flex justify-between items-center"
          style={{
            backgroundImage: "url('/mbfaqbg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          onClick={() => invert(index)}
        >
          <p className="text-[rgba(238,236,217,1)] ml-[15px] font-bold text-[12px] tracking-[0.04em] leading-[110%]">
            {question}
          </p>
          <img
            src="/downup.png"
            alt="toggle"
            className={`w-[16px] h-[15px] mr-[20px] cursor-pointer transition-transform duration-500 ${
              openIndex.includes(index) ? "rotate-180" : "rotate-0"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              invert(index);
            }}
          />
        </div>

        <div
           className={`transition-all w-[340px] h-[132px] max-sm:w-[270px] max-sm:h-[105px] md:w-[65%] md:h-[165px] duration-500 ease-in-out overflow-hidden flex justify-center items-center ${
                openIndex.includes(index) ? "h-[145px] opacity-100 mt-[-25px] " : "max-h-0 opacity-0"
            }`}
          style={{
            backgroundImage: "url('/mbfaqansbg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex justify-center items-center h-[110px] p-[10px] mt-[15px] font-normal text-[12px] tracking-[0.02em] leading-[140%] w-[300px] break-words whitespace-normal">
            {answer}
          </div>
        </div>
      </div>
    </>
  );
}

FAQItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
