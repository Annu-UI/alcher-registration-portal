import { useEffect, useState, useRef } from 'react';
import {useNavigate } from 'react-router-dom';
import { Alert } from './Alert';
import axiosInstance from '../utils/axiosInstance';
import background from '../assets/bg_add.svg';
import namesbg from '../assets/names_team.svg';
import profilepic from "../assets/profilepic.svg";
import removeoutline from "../assets/removeoutline.svg";
import searchbar from "../assets/searchbar.svg";
import searchbutton from "../assets/searchbutton.svg";
import addbg from "../assets/addbg.svg";
import addbutton from "../assets/addbutton.svg";
import close from "../assets/close.svg";
import addmembtn from "../assets/addmembtn.png";
import inputbg from "../assets/inputbg.svg";
import inputbgfocus from "../assets/inputbgfocus.svg"
import discard from "../assets/discard.svg";
import addmem from "../assets/addmembutton.svg"
import mbaddmembtn from "../assets/mbaddmembtn.svg";
import mbserach from "../assets/mbsearch.svg";
import mbaddforminpbg from "../assets/mbaddforminpbg.svg";
import mbmembg from "../assets/mbmembg.svg";
import mbaddmem from "../assets/mbaddmem.svg";
import authorPlaceholder from "../assets/author-placeholder.png";
import DecoratedButton from './AuthPage/DecoratedButton';

export function AddMembers() {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [members, setMembers] = useState([
        { id: null, tempId: null, name: "", email: "", gender: "Male", phone: "", collegename: "", city: "", state: "" }
    ]);
    const [names, setNames] = useState([]);
    const [filteredNames, setFilteredNames] = useState([]);
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');
    const [text, setText] = useState("");
    const [addpop, setAddpop] = useState(false);

    const STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (!token) {
            alert('You are not logged in.');
            return;
        }

        axiosInstance
        .get(`/profile/`)
        .then((res) => {

            let pic;
            // Priority 1: User has a manually uploaded image that isn't the DB default.
            if (res.data.img && !res.data.img.includes('user-default.png')) {
                pic = res.data.img;
            } 
            // Priority 2: User signed up with Google and has a Google picture URL.
            else if (res.data.provider === 'google' && res.data.profile_pic_url) {
                pic = res.data.profile_pic_url;
            } 
            // Priority 3: Fallback for manual sign-ups or any other case.
            else {
                pic = authorPlaceholder;
            }

            const dataFromApi = {
                ...res.data,
                profilePic: pic,
                // Ensure phone numbers are empty strings if null
                phone_number: res.data.phone_number || "",
                alternate_phone: res.data.alternate_phone || "",
            };

            setProfile(dataFromApi);
        
        })
        .catch(() => setMessage('Failed to load profile.'));
    }, []);


    //console.log(profile);

    function generateTempId() {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
    }

    // Add new member
    const addDiv = () => {
        setMembers([
            ...members,
            { id: null, tempId: generateTempId(), name: "", email: "", gender: "Male", phone: "", collegename: "", city: "", state: "" }
        ]);

        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({
                    top: 784,
                    behavior: "smooth"
                });
            }
        }, 100);
    };

    // Remove member
    const removeDiv = (id, tempId) => {
        if (members.length === 1) {
            alert("At least one member form is required.");
            //coustom alert
            //showAlert("At least one member form is required.");
            return;
        }

        setMembers(members.filter(item => {
            if (id) {
                return item.id !== id;
            } else {
                return item.tempId !== tempId;
            }
        }));

        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({
                    top: -290,
                    behavior: "smooth"
                });
            }
        }, 100);
    };


    const removemember = async (id, tempId) => {
        console.log(id);
        const token = localStorage.getItem("access");
        if (id) {
            try {
               await axiosInstance.delete(`/Participantdata/Participant/${id}/`);
                
            } catch (err) {
                console.error(err);
                return; // Stop if backend delete failed
            }
        }


        await displayNames(); // <-- ADD THIS LINE
    }

    // Handle field change (works for new and saved members)
    const handleChange = (id, tempId, field, value) => {
        setMembers(members.map(m =>
            (id ? m.id === id : m.tempId === tempId)
                ? { ...m, [field]: value }
                : m
        ));
    };

    const makediscard = () => {
        setMembers(prevMembers =>
            prevMembers.map(member => ({
                ...member,
                name: "",
                email: "",
                gender: "Male",   // or keep previous if you prefer: member.gender
                phone: "",
                collegename: "",
                city: "",
                state: ""
            }))
        );
    };


    // Submit to backend
    const submit = async () => {
        // Check if any field is empty
        const invalidMembers = [];
        for (let member of members) {
            // Check empty fields
            if (!member.name.trim() || !member.email.trim() || !member.phone.trim() || !member.collegename.trim() || !member.city.trim() || !member.state.trim()) {
                alert("Please fill in all fields before submitting.");
                //showAlert("Please fill in all fields before submitting.")
                return;
            }

            // Check phone length
            const phoneRegex = /^[6-9]\d{9}$/;  // Indian numbers start 6-9 and are 10 digits
            if (!phoneRegex.test(member.phone)) {
                invalidMembers.push(`${member.name} (Invalid phone number: ${member.phone})`);
            }


            // Check that name, city, college contain only letters
            const lettersRegex = /^[A-Za-z\s]+$/; // letters and spaces only
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!lettersRegex.test(member.name)) {
                invalidMembers.push(`${member.name} (Invalid name)`);
            }
            if (!lettersRegex.test(member.city)) {
                invalidMembers.push(`${member.name} (Invalid city)`);
            }
            if (!lettersRegex.test(member.collegename)) {
                invalidMembers.push(`${member.name} (Invalid college name)`);
            }
            if (!emailRegex.test(member.email)) {
                invalidMembers.push(`${member.name} (Invalid email)`);
            }
        }

        if (invalidMembers.length > 0) {
            alert("Please fix the following:\n" + invalidMembers.join("\n"));
            //showAlert("Please fix the following:\n" + invalidMembers.join("\n"));
            return;
        }

        try {
            await Promise.all(
                members.map(async (member) => {
                    const token = localStorage.getItem('access');
                    const payload = {
    name: member.name,
    email: member.email,
    gender: member.gender === "Male" ? "M" : member.gender === "Female" ? "F" : "O",
    phone: `+91${member.phone}`,
    collegename: member.collegename,
    city: member.city,
    state: member.state,
};
// Return the promise for Promise.all
return axiosInstance.post("/Participantdata/Participant/", payload);
                    
                })
            );

            //alert("All members saved successfully!");
            setMembers([
                { id: null, name: "", email: "", gender: "Male", phone: "", collegename: "", city: "", state: "" }
            ]);
        } catch (err) {
            console.error("Failed to save members:", err);
const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
alert(`Failed to save members: ${errorMsg}`);
        }

        displayNames();
        setAddpop(false);
    };

    // ... (inside AddMembers function)

    const displayNames = async() => {
    try {
        // Replaced fetch GET with axiosInstance.get
        const response = await axiosInstance.get("/Participantdata/Participant/");
        const data = response.data; // Data is directly on response.data
        console.log("Fetched Data:", data);

        // Removed the !response.ok check, axios handles non-2xx statuses in 'catch'
        if (Array.isArray(data)) {
            const names = data.map((item) => ({
                id: item.id,
                tempId: item.tempId, // Keep tempId if your backend sends it
                name: item.name,
                email: item.email,
            }));
            console.log("Mapped Names:", names);
            setNames(names);
            setFilteredNames(names); // Update filtered names too
        } else {
            console.error("API returned non-array data:", data);
            setNames([]); // Reset to empty array
            setFilteredNames([]);
        }
    } catch (error) {
        // Axios error handling
        console.error("Fetch operation failed:", error);
        setMessage("Failed to load team members."); // Inform user
        setNames([]); // Reset state on network/parsing error
        setFilteredNames([]);
    }
}
    // ... (rest of your component logic)

    useEffect(()=>{displayNames()},[]);

    const searchNames = () => {
        console.log("search text:", text);

        // filter safely using optional chaining
        const results = names.filter(
            (n) =>
                n?.name &&
                n.name.toLowerCase().includes(text.toLowerCase())
        );

        setFilteredNames(results);
        console.log("results:", results);
    };

    useEffect(() => {
        if (text !== "") {
            searchNames();
        } else {
            setFilteredNames(names); // show all if text is empty
        }
    }, [text]);

    const namesToDisplay = text ? filteredNames : names; //which array to display

    const searchBgStyle = {
        backgroundImage: `url(${searchbar})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const namesBgStyle = {
        backgroundImage: `url(${namesbg})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const mbnamesBgStyle = {
        backgroundImage: `url(${mbmembg})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const addBgStyle = {
        backgroundImage: `url(${addbg})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const mbaddBgStyle = {
        backgroundImage: `url(${mbaddmem})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const addmemBgStyle = {
        backgroundImage: `url(${addmembtn})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const discardBgStyle = {
        backgroundImage: `url(${discard})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };

    const addmembtnBgStyle = {
        backgroundImage: `url(${addmem})`,
        backgroundPosition: 'center', // centers the image
        backgroundSize: 'cover',      // makes it cover the div
        backgroundRepeat: 'no-repeat' // prevents tiling
    };


    const noscroolbar = {
        /* Hide scrollbar for Firefox + Edge */
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
    }



    useEffect(() => {
        if (addpop) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [addpop]);



    return (
        <div className='w-full h-full flex flex-col items-center justify-start '>

            {/* laptop add mem form*/}
            {addpop &&
                <div className='fixed inset-0 bg-black/60 z-50 lg:flex hidden items-center flex-col justify-center ' onClick={() => setAddpop(false)}>
                    <div className='h-[67px] lg:h-[81px] lg:w-[800px] w-[319px]' onClick={(e) => e.stopPropagation()}>
                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-row'>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                            <div className='lg:w-[746px] lg:h-[27px] h-[15px] w-[289px] bg-alch-dark'></div>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                        </div>

                        <div className='lg:w-[800px] lg:h-[33px] h-[37px] w-[319px] flex justify-between lg:px-[50px] px-[20px] items-center bg-alch-dark'>
                            <p className='font-sans lg:text-2xl text-[16px] font-semibold text-alch-cream'>Add Team Member</p>
                            <button onClick={() => { setAddpop(false) }}><img src={close} alt='close' className='lg:h-[32px] lg:w-[32px] h-[22px] w-[22px]' /></button>
                        </div>

                        <div className='h-[15px] lg:h-[27px] lg:w-[800px] w-[319px] flex flex-col justify-center items-center bg-alch-dark ' onClick={(e) => e.stopPropagation()}>
                        </div>
                    </div>

                    <div className='lg:h-[70%] h-[600px] lg:w-[800px] w-[319px] flex flex-col overflow-y-auto bg-alch-cream' ref={scrollRef} style={noscroolbar} onClick={(e) => e.stopPropagation()}>
                        <div
                            className='flex flex-col'
                        >
                            <div>
                                {members.map((item, index) => (
                                    <div className='flex flex-col items-center my-[30px]' key={item.tempId} >
                                        <div className='flex flex-row justify-between items-center lg:w-[635px] w-[250px]'>
                                            <div className='flex items-center justify-center'>
                                                <p className='font-sans text-[18px] leading-[140%] tracking-[2%]'>Member {index + 1}</p>
                                                <button className='lg:hidden block' onClick={addDiv} ><img src={mbaddmembtn} alt='close' className='h-[32px] w-[32px]' /></button>
                                            </div>
                                            <button onClick={() => removeDiv(item.id, item.tempId)}><img src={close} alt='close' className='h-[32px] w-[32px]' /></button>
                                        </div>
                                        <ul className='font-sans text-[16px] leading-[140%] tracking-[2%] flex flex-col items-center'>
                                            <li className='lg:h-[84px] h-[57px] mt-[24px]'>
                                                <label className='lg:h-[25px] h-[22px] font-sans lg:text-[18px] text-[16px] leading-[140%] tracking-[2%]'>Full Name</label><br />
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "name", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Email*</label><br />
                                                <input
                                                    type="email"
                                                    value={item.email}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "email", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Gender*</label><br />
                                                <select
                                                    value={item.gender}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "gender", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 appearance-none'
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Phone Number*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.phone}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "phone", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 '
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>College Name*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.collegename}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "collegename", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>City Name*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.city}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "city", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>State*</label><br />
                                                <select
                                                    value={item.state}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "state", e.target.value)}
                                                     
                                                    className=' input-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px]  lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 appearance-none'
                                                >
                                                    <option value="">Select a State</option>
                                                    {STATES.map((st) => (
                                                        <option key={st} value={st}>
                                                            {st}
                                                        </option>
                                                    ))}
                                                </select>
                                            </li>
                                        </ul>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='h-[67px] lg:h-[81px] lg:w-[800px] w-[319px] border-t-[1px] border-alch-dark' onClick={(e) => e.stopPropagation()}>
                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-col justify-center items-center bg-alch-cream ' onClick={(e) => e.stopPropagation()}>
                        </div>

                        <div className='flex lg:w-[800px] w-[319px] justify-center bg-alch-cream px-6 lg:px-10'>
                            <div className='flex flex-row ml-auto mr-[10px] gap-[31.73px] lg:mr-[30px]'>

                                <button
                                    className='w-[109.27px] h-[34.62px]'
                                    onClick={makediscard}
                                    style={discardBgStyle}
                                >
                                    <p className='font-sans text-[16px] font-bold text-alch-red'>Discard</p>
                                </button>

                                <button
                                    className='w-[132px] h-[34.62px]'
                                    onClick={addDiv}
                                    style={addmembtnBgStyle}
                                >
                                    <p className='font-sans text-[16px] font-bold text-alch-dark'>Add Member</p>
                                </button>

                                <DecoratedButton
                                    onClick={submit}
                                    className='font-sans text-[16px] font-bold text-alch-dark'
                                >
                                    Done
                                </DecoratedButton>
                            </div>
                        </div>


                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-row'>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                            <div className='lg:w-[746px] lg:h-[27px] h-[15px] w-[289px] bg-alch-cream'></div>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                        </div>
                    </div>
                </div>
            }

            {/* mobile add mem form*/}
            {addpop &&
                <div className='fixed inset-0 bg-black/60 z-50 flex lg:hidden items-center flex-col justify-center' onClick={() => setAddpop(false)}>
                    <div className='h-[67px] lg:h-[81px] lg:w-[800px] w-[319px]' onClick={(e) => e.stopPropagation()}>
                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-row'>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                            <div className='lg:w-[746px] lg:h-[27px] h-[15px] w-[289px] bg-alch-dark'></div>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                        </div>

                        <div className='lg:w-[800px] lg:h-[33px] h-[37px] w-[319px] flex justify-between lg:px-[50px] px-[20px] items-center bg-alch-dark'>
                            <p className='font-sans lg:text-2xl text-[16px] font-semibold text-alch-cream'>Add Team Member</p>
                            <button onClick={() => { setAddpop(false) }}><img src={close} alt='close' className='lg:h-[32px] lg:w-[32px] h-[22px] w-[22px]' /></button>
                        </div>

                        <div className='h-[15px] lg:h-[27px] lg:w-[800px] w-[319px] flex flex-col justify-center items-center bg-alch-dark ' onClick={(e) => e.stopPropagation()}>
                        </div>
                    </div>

                    <div className='h-[75%] w-[319px] flex flex-col overflow-y-auto bg-alch-cream' style={noscroolbar} onClick={(e) => e.stopPropagation()}>
                        <div
                            className='flex flex-col'
                        >
                            <div>
                                {members.map((item, index) => (
                                    <div className='flex flex-col items-center my-[30px]' key={item.tempId} >
                                        <div className='flex flex-row justify-between items-center lg:w-[635px] w-[250px]'>
                                            <div className='flex items-center justify-center gap-[10px]'>
                                                <p className='font-sans text-[18px] leading-[140%] tracking-[2%]'>Member {index + 1}</p>
                                                <button className='lg:hidden block' onClick={addDiv} ><img src={mbaddmembtn} alt='close' className='h-[37px] w-[37px]' /></button>
                                            </div>
                                            <button onClick={() => removeDiv(item.id, item.tempId)}><img src={close} alt='close' className='h-[32px] w-[32px]' /></button>
                                        </div>
                                        <ul className='font-sans text-[16px] leading-[140%] tracking-[2%] flex flex-col items-center'>
                                            <li className='lg:h-[84px] h-[57px] mt-[24px]'>
                                                <label className='lg:h-[25px] h-[22px] font-sans lg:text-[18px] text-[16px] leading-[140%] tracking-[2%]'>Full Name</label><br />
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "name", e.target.value)}
                                                     
                                                    className='mbinput-bg w-[261px] h-[31px] mt-[11px] outline-none px-[15px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Email*</label><br />
                                                <input
                                                    type="email"
                                                    value={item.email}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "email", e.target.value)}
                                                     
                                                    className='mbinput-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Gender*</label><br />
                                                <select
                                                    value={item.gender}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "gender", e.target.value)}
                                                     
                                                    className='mbinput-bg lg:w-[560px] w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 appearance-none'
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>Phone Number*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.phone}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "phone", e.target.value)}
                                                     
                                                    className='mbinput-bg lg:w-[560px] w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 '
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>College Name*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.collegename}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "collegename", e.target.value)}
                                                     
                                                    className='mbinput-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>City Name*</label><br />
                                                <input
                                                    type="text"
                                                    value={item.city}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "city", e.target.value)}
                                                     
                                                    className='mbinput-bg w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px] lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0'
                                                />
                                            </li>
                                            <li className='mt-[24px]'>
                                                <label>State*</label><br />
                                                <select
                                                    value={item.state}
                                                    onChange={(e) => handleChange(item.id, item.tempId, "state", e.target.value)}
                                                     
                                                    className='mbinput-bg lg:w-[560px] w-[261px] lg:h-[45px] h-[31px] mt-[11px] outline-none px-[15px]  lg:text-[14px] text-[12px] bg-transparent focus:outline-none focus:ring-0 appearance-none'
                                                >
                                                    <option value="">Select a State</option>
                                                    {STATES.map((st) => (
                                                        <option key={st} value={st}>
                                                            {st}
                                                        </option>
                                                    ))}
                                                </select>
                                            </li>
                                        </ul>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='h-[67px] lg:h-[81px] lg:w-[800px] w-[319px] border-t-[1px] border-alch-dark' onClick={(e) => e.stopPropagation()}>
                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-col justify-center items-center bg-alch-cream ' onClick={(e) => e.stopPropagation()}>
                        </div>

                        <div className='flex lg:justify-between justify-center items-center lg:w-[800px] w-[319px] bg-alch-cream'>
                            <button className='hidden lg:block h-[35px] w-[157px] ml-[31.73px]' onClick={addDiv} style={addmemBgStyle}><p className='font-sans text-[16px] font-bold text-alch-dark'>Add Form</p></button>
                            <div className='flex flex-row gap-[31.73px] lg:mr-[30px]'>
                                <button className='w-[109.27px] h-[34.62px]' onClick={makediscard} style={discardBgStyle}><p className='font-sans text-[16px] font-bold text-alch-red'>Discard</p></button>
                                <DecoratedButton
                                    onClick={submit}
                                    className='font-sans text-[16px] font-bold text-alch-dark'
                                >
                                    Done
                                </DecoratedButton>
                            </div>
                        </div>

                        <div className='lg:h-[27px] h-[15px] lg:w-[800px] w-[319px] flex flex-row'>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                            <div className='lg:w-[746px] lg:h-[27px] h-[15px] w-[289px] bg-alch-cream'></div>
                            <div className='lg:h-[27px] lg:w-[27px] h-[15px] w-[15px] bg-transparent'></div>
                        </div>
                    </div>
                </div>
            }

            <div 
                className='lg:h-full lg:w-full h-auto w-[371px] flex items-center lg:justify-center flex-col'
                // style={headerBgStyle}
            >
                    <div className=' w-[100%] flex items-center'>
                        {/* laptop search */}
                        <div
                            style={searchBgStyle}
                            className='lg:h-[38px] lg:w-[450px] hidden lg:flex items-center mb-[32px] mt-[56px] lg:mt-[0] ml-[8px]'
                        >
                            <button><img src={searchbutton} alt='search' className='ml-[16px]'/></button>
                            <input 
                                placeholder='Search' 
                                className='bg-transparent ml-[10px] font-sans font-semibold text-base leading-none tracking-normal outline-none flex-grow'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className=' w-[100%] flex items-center justify-center'>
                        {/* mobile search */}
                        <div
                            style={{
                                backgroundImage: `url(${mbserach})`,
                                backgroundPosition: 'center', // centers the image
                                backgroundSize: 'cover',      // makes it cover the div
                                backgroundRepeat: 'no-repeat'
                            }}
                            className='w-[330px] h-[32px] max-sm:w-[254.8px] max-sm:h-[26px] lg:hidden flex items-center mb-[32px] mt-[30px] lg:mt-[0]'
                        >
                            <button><img src={searchbutton} alt='search' className='ml-[16px]'/></button>
                            <input 
                                placeholder='Search' 
                                className='bg-transparent ml-[10px] font-sans font-semibold text-[12px] leading-none tracking-normal outline-none flex-grow'
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className='lg:w-full w-100% h-auto flex justify-center items-start flex-col lg:flex-row gap-[16px] lg:gap-[27px]'>
                        <div className=' h-100% w-100% flex flex-col gap-[16px]'>
                            {/* laptop leader */}
                            {!text && (
                                <div
                                    className='lg:w-[450px] lg:h-[49.5px] w-[336px] h-[56px] hidden lg:flex justify-center items-center cursor-pointer'
                                    style={namesBgStyle}
                                >   
                                    <div className='lg:w-[95%] lg:h-[38px] w-[315.55px] h-[38px] flex justify-between items-center'>
                                        <div className='flex justify-between items-center gap-[17px]'>
                                            <img src={profile?.profilePic || profilepic} alt='profile' className='w-[32.11px] h-[32.11px]'/>
                                            <div className='h-[38px] flex flex-col justify-between'>
                                                <p className='font-sans font-semibold text-[16px] leading-[100%] tracking-[0px]'>
                                                    {profile ? profile.fullname.toUpperCase() : "Loading..."}
                                                </p>
                                                <p className='font-sans font-normal text-[12px] leading-[100%] tracking-[0px]' >
                                                    {profile ? profile.email : "loading..."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='p-[5px] rounded-[2.5px] bg-alch-red text-alch-cream text-center font-sans font-semibold text-[16px] leading-[100%] tracking-[0px]'>Leader</div>
                                    </div> 
                                </div>
                            )}
                            {/* mobile leader */}
                            {!text && (
                                <div
                                    className='w-[325px] h-[55px] max-sm:w-[260px] max-sm:h-[44px] flex lg:hidden justify-center items-center cursor-pointer'
                                    style={mbnamesBgStyle}
                                    onClick={() => navigate('/profile')}
                                >   
                                    <div className='w-[300px] h-[38px] max-sm:w-[240px] max-sm:h-[44px] flex justify-between items-center'>
                                        <div className='flex justify-between items-center gap-[17px]'>
                                            <img src={profile?.profilePic || profilepic} alt='profile' className='w-[32.11px] h-[32.11px]'/>
                                            <div className='h-[30px] flex flex-col justify-between'>
                                                <p className='font-sans font-semibold text-[14px] leading-[100%] tracking-[0px]'>
                                                    {profile ? profile.fullname.toUpperCase() : "Loading..."}
                                                </p>
                                                <p className='font-sans font-normal text-[10px] leading-[100%] tracking-[0px]' >
                                                    {profile ? profile.email : "loading..."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='p-[5px] rounded-[2.5px] bg-alch-red text-alch-cream text-center font-sans font-semibold text-[14px] leading-[100%] tracking-[0px]'>Leader</div>
                                    </div> 
                                </div>
                            )}

                        {/* names of even index in laptop */}

                        {namesToDisplay &&
                            namesToDisplay
                                .filter((_, index) => index % 2 === 1)
                                .map((item) => (
                                    <div className='lg:w-[450px] lg:h-[49.5px] w-[336px] h-[56px] hidden lg:flex justify-center items-center' style={namesBgStyle} key={item.id}>
                                        <div className='lg:w-[95%] lg:h-[38px] w-[315.55px] h-[38px] flex justify-between items-center mx-[20px]'>
                                            <div className='h-[38px] flex justify-center items-center '>
                                                {/* <img src={profilepic} alt='profile' className='w-[32.11px] h-[32.11px]'/> */}
                                                <div className='flex flex-col justify-between h-[38px]'>
                                                    <p className='font-sans font-semibold text-[16px] leading-[100%] tracking-[0px]'>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
                                                    <p className='font-sans font-normal text-[12px] leading-[100%] tracking-[0px]' >{item.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removemember(item.id, item.tempId)} ><img src={removeoutline} alt='remove' /></button>
                                        </div>
                                    </div>
                                ))
                        }

                        {/* names of all mem in mobile */}
                        {namesToDisplay &&
                            namesToDisplay
                                .map((item) => (
                                    <div className='w-[325px] h-[55px] max-sm:w-[260px] max-sm:h-[44px] flex lg:hidden justify-center items-center' style={mbnamesBgStyle} key={item.id}>
                                        <div className='w-[300px] h-[38px] flex justify-between items-center mx-[15px]'>
                                            <div className='h-[38px] flex justify-center items-center '>
                                                {/* <img src={profilepic} alt='profile' className='w-[32.11px] h-[32.11px]'/> */}
                                                <div className='flex flex-col justify-between h-[30px]'>
                                                    <p className='font-sans font-semibold text-[14px] leading-[100%] tracking-[0px]'>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
                                                    <p className='font-sans font-normal text-[10px] leading-[100%] tracking-[0px]' >{item.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removemember(item.id, item.tempId)} ><img src={removeoutline} alt='remove' /></button>
                                        </div>
                                    </div>
                                ))
                        }

                        {/* add mem form btn laptop */}
                        <div onClick={() => { setAddpop(true) }} className='lg:w-[450px] lg:h-[49.5px] w-[336px] h-[56px] hidden lg:flex  justify-center items-center cursor-pointer' style={addBgStyle}>
                            <div className='flex justify-between items-center lg:w-[95%] lg:h-[38px] w-[315.55px] h-[38px]'>
                                <p className='font-sans font-bold text-base' >Add more Members</p>
                                <button><img src={addbutton} alt='add' className='w-[24px] h-[24px]' /></button>
                            </div>
                        </div>
                        {/* add mem form btn mobile */}
                        <div onClick={() => { setAddpop(true) }} className='w-[325px] h-[55px] max-sm:w-[260px] max-sm:h-[44px] flex lg:hidden justify-center items-center cursor-pointer' style={mbaddBgStyle}>
                            <div className='flex justify-between items-center w-[90%] h-[38px]'>
                                <p className='font-sans font-bold text-[14px]' >Add more Members</p>
                                <button><img src={addbutton} alt='add' className='w-[24px] h-[24px]' /></button>
                            </div>
                        </div>
                    </div>

                    {/* names of mem of odd index in laptop */}

                    <div className=' h-100% w-100% hidden lg:flex flex-col lg:gap-[16px]'>
                        {/* <div className='w-[526px] h-[58.08px]'></div> */}
                        {namesToDisplay.length === 0 && <div className='lg:w-[450px] lg:h-[49.5px] w-[336px] h-[56px]'></div>}
                        {namesToDisplay &&
                            namesToDisplay
                                .filter((_, index) => index % 2 === 0)
                                .map((item) => (
                                    <div className='lg:w-[450px] lg:h-[49.5px] w-[336px] h-[56px] flex justify-center items-center' style={namesBgStyle} key={item.id}>
                                        <div className='lg:w-[95%] lg:h-[38px] w-[315.55px] h-[38px] flex justify-between items-center mx-[20px]'>
                                            <div className='h-[38px] flex justify-center items-center '>
                                                {/* <img src={profilepic} alt='profile' className='w-[32.11px] h-[32.11px]'/> */}
                                                <div className='flex flex-col justify-between h-[38px]'>
                                                    <p className='font-sans font-semibold text-[16px] leading-[100%] tracking-[0px]'>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</p>
                                                    <p className='font-sans font-normal text-[12px] leading-[100%] tracking-[0px]' >{item.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removemember(item.id, item.tempId)} ><img src={removeoutline} alt='remove' /></button>
                                        </div>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}