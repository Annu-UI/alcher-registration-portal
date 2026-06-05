import { useState, forwardRef } from "react"
import flower from "../../assets/heading-icon-red.svg"
import FAQItem from "./FAQItem";

export const FAQS = forwardRef((props, ref) => {
    const [openindex, setOpenindex] = useState([]);
    const invert = (index) => {
        if (openindex.includes(index)) {
            setOpenindex(openindex.filter(i => i !== index));
        } else {
            setOpenindex([...openindex, index]);
        }
    }

    const faqs = [
        {
            question: "WHERE IS ALCHERINGA HELD?",
            answer:
            "Alcheringa is held at the Indian Institute of Technology Guwahati (IITG) campus, Assam.",
        },
        {
            question: "WHAT IS ALCHERINGA?",
            answer:
            "Alcheringa is the annual cultural festival of IIT Guwahati and one of the largest college festivals in India, featuring competitions, concerts, and workshops.",
        },
        {
            question: "WHO CAN PARTICIPATE IN ALCHERINGA?",
            answer:
            "Students from colleges and universities across India can participate in various competitions, events, and workshops.",
        },
        {
            question: "IS THERE ANY REGISTRATION FEE?",
            answer:
            "Most events at Alcheringa are free to participate in, but some may require a nominal registration fee. Details are mentioned on the event pages.",
        },
        {
            question: "HOW CAN I REGISTER FOR EVENTS?",
            answer:
            "You can register for any event through the official Alcheringa website after logging into your account on the registration portal.",
        },
        {
            question: "WHAT KIND OF EVENTS ARE ORGANIZED?",
            answer:
            "Alcheringa hosts a wide range of events including dance, music, drama, fine arts, photography, fashion, literary, and gaming competitions.",
        },
        {
            question: "ARE THERE ANY STAR NIGHTS OR CONCERTS?",
            answer:
            "Yes! Alcheringa is known for its electrifying star nights featuring top artists and performers from across India and the world.",
        },
        {
            question: "CAN I STAY ON CAMPUS DURING THE FESTIVAL?",
            answer:
            "Yes, registered participants and college contingents can avail accommodation facilities on the IIT Guwahati campus during the festival.",
        },
        {
            question: "HOW CAN I REACH IIT GUWAHATI?",
            answer:
            "The campus is located about 20 km from Guwahati city. You can reach by taxi or cab from Guwahati Railway Station or Lokpriya Gopinath Bordoloi International Airport.",
        },
        {
            question: "WHAT IS THE THEME OF THIS YEAR’S EDITION?",
            answer:
            "The theme for Alcheringa 2026 will be revealed soon! Stay tuned to our social media handles for the official announcement.",
        },
        {
            question: "HOW CAN I VOLUNTEER OR JOIN THE ALCHERINGA TEAM?",
            answer:
            "You can  be part of our extended community by joining the Campus Ambassador Program. To know more and apply, visit caportal.alcheringa.co.in",
        },
        {
            question: "WHERE CAN I FOLLOW ALCHERINGA UPDATES?",
            answer:
            "You can follow Alcheringa on Instagram, Facebook, YouTube, and the official website to stay updated about upcoming events and announcements.",
        },
        {
            question: "WHO SHOULD I CONTACT FOR QUERIES?",
            answer:
            "For any queries, you can contact the respective event coordinators listed on the website or email us at info@alcheringa.co.in",
        },
    ];



    return(
        <div className="h-auto w-full  flex flex-col" ref={ref}>
            <div className=" flex justify-center items-center mt-[20px] gap-[10px]  text-center font-display text-4xl sm:text-5xl font-extrabold text-alch-dark">
                
                    <img src={flower} alt="red"/>
                    FAQS
                    <img src={flower} alt="red"/>
            </div>
            <div className="flex flex-col items-center gap-4 mt-[50px]">
                {faqs.map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
            </div>
        </div>
    )
});