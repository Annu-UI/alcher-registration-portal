// src/pages/ProfilePage.js
import React, { useState, useEffect, useRef , useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import axios from "axios";
import { FiMail, FiChevronDown } from "react-icons/fi";
// Import all necessary components and assets
import { ReactComponent as AuthFrame } from "../assets/auth-frame.svg";
import { ReactComponent as TabBarDeco } from "../assets/nav-item-deco.svg";
import DecoratedInput from "../components/AuthPage/DecoratedInput.js";
import DecoratedButton from "../components/AuthPage/DecoratedButton.js";
import authorPlaceholder from "../assets/author-placeholder.png";
import backgroundPattern from "../assets/background-pattern.svg";
import { AddMembers } from '../components/AddMembers.js';
import profilewbg from "../assets/profilewbg.svg";
import profileobg from "../assets/profileobg.svg";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.js";
import logo from '../assets/logo.svg';
import MyRegistrations from "./MyRegisteredCompetitions.js";
import Cropper from 'react-easy-crop'; // +++ IMPORT CROPPER
import getCroppedImg from '../utils/cropImage'; // +++ IMPORT UTILITY

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  // State for displaying saved profile data
  const [profileData, setProfileData] = useState(null);
  // State for handling form input during editing
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [openindex, setOpenindex] = useState([1]);
  const [imageFile, setImageFile] = useState(null); // To hold the selected file
  const [imagePreview, setImagePreview] = useState(null); // To show a preview of the new image
  const fileInputRef = useRef(null); // To programmatically click the file input

  // +++ START: CROPPER STATE +++
  const [cropperOpen, setCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // +++ END: CROPPER STATE +++

  const invert = (index) => {
    // Only open new index; if already open, do nothing
    if (!openindex.includes(index)) {
      setOpenindex([index]);
    }
  };

  // inside ProfilePage component
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tabIndex) {
      const tab = location.state.tabIndex;
      console.log("in profilepage", tab);
      setOpenindex([tab]);
    }
  }, [location.state]);


  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("You are not logged in. Redirecting...");
      setIsLoading(false);
      setTimeout(() => navigate("/signin"), 2000);
      return;
    }
    axios
    .get(`${BASE_URL}/api/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        // +++ START: THIS IS THE LOGIC TO CHANGE +++
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
        // +++ END: LOGIC CHANGE +++

        const dataFromApi = {
          ...res.data,
          profilePic: pic,
          // Ensure phone numbers are empty strings if null
          phone_number: res.data.phone_number || "",
          alternate_phone: res.data.alternate_phone || "",
        };
        setProfileData(dataFromApi);
        setFormData(dataFromApi); // Initialize form data
        setImagePreview(dataFromApi.profilePic); // Set the initial image for preview
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(
          "Profile load failed:",
          err.response ? err.response.data : err.message
        );
        setError("Failed to load profile. Please log in again.");
        setIsLoading(false);
      });
  }, [navigate]);

 // +++ UPDATED: HANDLE IMAGE CHANGE TO OPEN CROPPER +++
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Create a URL for the selected file to show in the cropper
      const imageDataUrl = URL.createObjectURL(file);
      setTempImageSrc(imageDataUrl);
      setCropperOpen(true);
      // Reset file input so the same file can be selected again if needed
      e.target.value = null;
    }
  };

  // +++ NEW: CROPPER FUNCTIONS +++
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageBlob = await getCroppedImg(
        tempImageSrc,
        croppedAreaPixels
      );
      
      // Create a File object from the Blob to match your original upload logic
      const file = new File([croppedImageBlob], "profile_cropped.jpg", { type: "image/jpeg" });

      setImageFile(file); // Store the cropped file for upload
      setImagePreview(URL.createObjectURL(croppedImageBlob)); // Show preview of cropped image
      setCropperOpen(false); // Close modal
    } catch (e) {
      console.error(e);
      setError("Failed to crop image.");
    }
  }, [tempImageSrc, croppedAreaPixels]);

  const handleCropperClose = () => {
    setCropperOpen(false);
    setTempImageSrc(null);
  };
  // +++ END: CROPPER FUNCTIONS +++

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/signin";
  };

  const handleChange = (e) => {
    // Update the temporary formData state, not the main profileData
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveSuccess(false);
    setError("");
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError("");
    setSaveSuccess(false);
  };
  
  // ADDED: Cancel button functionality
  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(profileData); // Revert any changes
    setImageFile(null); // Clear the selected file from state
    setImagePreview(profileData.profilePic); // Revert the preview to the original image
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;

    // Validation before submitting
  const { fullname, email, phone_number, alternate_phone, collegename, city, state } = formData;

  
  if (!fullname.trim() || !email.trim() || !phone_number.trim() || !collegename.trim() || !city.trim() || !state.trim()) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  // Validate phone numbers (+91xxxxxxxxxx format)
const phoneRegex = /^\+91[6-9]\d{9}$/;
if (!phoneRegex.test(phone_number)) {
  alert("Phone number must be in the format +91XXXXXXXXXX (10 digits after +91).");
  return;
}

if (alternate_phone && !phoneRegex.test(alternate_phone)) {
  alert("Alternate phone number must be in the format +91XXXXXXXXXX (10 digits after +91).");
  return;
}


  // Validate letters-only fields
  const lettersRegex = /^[A-Za-z\s]+$/;
  if (!lettersRegex.test(fullname)) {
    alert("Full Name can only contain letters and spaces.");
    return;
  }
  if (!lettersRegex.test(city)) {
    alert("City can only contain letters and spaces.");
    return;
  }
  if (!lettersRegex.test(collegename)) {
    alert("College Name can only contain letters and spaces.");
    return;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return;
  }

    setIsSaving(true);
    setSaveSuccess(false);
    setError("");
    const token = localStorage.getItem("access");

    // Construct the data to send from the formData state
    const dataToSend = new FormData();
    dataToSend.append('fullname', formData.fullname);
    dataToSend.append('gender', formData.gender);
    dataToSend.append('collegename', formData.collegename);
    dataToSend.append('team_name', formData.team_name);
    dataToSend.append('city', formData.city);
    dataToSend.append('state', formData.state);
    dataToSend.append('phone_number', String(formData.phone_number || "").trim());
    dataToSend.append('alternate_phone', String(formData.alternate_phone || "").trim());

    if (imageFile) {
        dataToSend.append('img', imageFile);
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/auth/edit-profile/`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const updatedUser = { ...profileData, ...response.data.user,profilePic: response.data.user.img || response.data.user.profile_pic_url || authorPlaceholder };
      
      // Update both states with the saved data from the backend
      setProfileData(updatedUser);
      setFormData(updatedUser);

      setImageFile(null);
      setImagePreview(updatedUser.profilePic);  

      setSaveSuccess(true);
      setIsEditing(false); // Switch back to VIEW mode
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      const responseError = err.response?.data;
      let errorMessage = "Failed to save profile. Check your input.";
      if (responseError) {
        errorMessage = Object.keys(responseError)
          .map(key => `${key}: ${responseError[key]}`)
          .join(" ");
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = ["Profile", "My registration", "Team members"];

  if (isLoading) {
    return (
      // <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center">
      //   Loading profile...
      // </div>
      <LoadingScreen/>
    );
  }
  
  // Use formData for the form values, as it can be null before the API call finishes
  if (!formData || !profileData) return null; 

  return (
    <div className="pixelbg min-h-screen bg-brand-dark p-4 sm:p-8">
      {/* +++ INSERT CROPPER MODAL HERE +++ */}
      {cropperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative w-full max-w-md bg-alch-dark border-2 border-alch-cream p-4 rounded-lg">
            <div className="relative h-64 sm:h-80 w-full bg-gray-900 mb-4">
              <Cropper
                image={tempImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex items-center gap-2 mb-4">
               <span className="text-alch-cream text-sm">Zoom</span>
               <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={handleCropperClose}
                className="px-4 py-2 text-sm text-alch-cream hover:text-white"
              >
                Cancel
              </button>
              <DecoratedButton onClick={showCroppedImage} size="sm">
                Done
              </DecoratedButton>
            </div>
          </div>
        </div>
      )}
      {/* +++ END CROPPER MODAL +++ */}
      <main className="w-full max-w-5xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div className="flex flex-row items-center justify-center gap-[20px]">
            {/* <div className="w-[50px] h-[50px] bg-slate-100 "></div> */}
            <img src={logo} alt="logo" className="w-[45px] cursor-pointer" onClick={()=>{navigate("/")}}/>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{`Welcome, ${profileData.fullname}`}</h1>
              <p className="text-gray-400">{`Alcher ID #${profileData.alcherid}`}</p>
            </div>
          </div>
          <DecoratedButton size="sm" onClick={handleLogout}>
            Logout
          </DecoratedButton>
        </div>


        <div className="w-full max-w-[1032px] mx-auto h-16 sm:h-20 mb-12 sm:mb-20 flex flex-col justify-center items-center">
          <div className="flex flex-row justify-between text-white w-full">
            <div className="flex flex-row items-center">
              <div className={`lg:w-[10px] w-[9px] lg:h-[12px] h-[8px] ${openindex.includes(1) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"}`}></div>
              <div className={`lg:w-[10px] w-[9px] lg:h-[30px] h-[24px] ${openindex.includes(1) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"}`}></div>
            </div>
            <div onClick={() => {setActiveTab("Profile"); invert(1)}}  className={`lg:h-[48px] h-[40px] w-[407px] flex justify-center items-center cursor-pointer text-[14px] lg:text-[16px] font-sans font-semibold ${openindex.includes(1) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"} ${openindex.includes(1) ? "text-[#171717]" : "text-[#17171766]"}`}>Profile</div>
            <div onClick={() => {setActiveTab("My registration"); invert(2)}} className={`lg:h-[48px] h-[40px] w-[428px] flex justify-center items-center cursor-pointer text-[14px] lg:text-[16px] font-sans font-semibold ${openindex.includes(2) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"}  ${openindex.includes(2) ? "text-[#171717]" : "text-[#17171766]"}`} >My registration</div>
            <div onClick={() => {setActiveTab("Team members"); invert(3)}} className={`lg:h-[48px] h-[40px] w-[407px] flex justify-center items-center cursor-pointer ttext-[14px] lg:text-[16px] font-sans font-semibold ${openindex.includes(3) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"} ${openindex.includes(3) ? "text-[#171717]" : "text-[#17171766]"}`}><span className="block lg:hidden">Members</span><span className="hidden lg:block">Team members</span></div>
            <div className="flex flex-row items-center">
              <div className={`lg:w-[10px] w-[9px] lg:h-[30px] h-[24px] ${openindex.includes(3) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"}`}></div>
              <div className={`lg:w-[10px] w-[9px] lg:h-[12px] h-[8px] ${openindex.includes(3) ? "bg-[#EEECD9]" : "bg-[#EEECD9E5]"}`}></div>
            </div>
          </div>
          <div className="flex mt-[7px] w-[calc(100%-40px)]">
            <img src={openindex.includes(1) ? profileobg : profilewbg} onClick={() => {invert(1)}} className="w-[calc((100%)/3)] cursor-pointer" alt="profile"/>
            <img src={openindex.includes(2) ? profileobg : profilewbg} onClick={() => {invert(2)}} className="w-[calc((100%)/3)] cursor-pointer" alt="profile"/>
            <img src={openindex.includes(3) ? profileobg : profilewbg} onClick={() => {invert(3)}} className="w-[calc((100%)/3)] cursor-pointer" alt="profile"/>
          </div>
        </div>

        <div className="relative w-full max-w-[1032px] mx-auto mt-[-2.5rem] pb-10">
          <AuthFrame
            className="absolute inset-0 w-full h-full text-brand-beige z-0"
            preserveAspectRatio="none"
          />
          <div className="relative z-10 p-6 sm:p-10">
            {openindex.includes(1) && (
              <div>
               <div className="flex items-center gap-x-4">
    
           {/* START: This is the new block for the image */}
          <div className="relative">
          <img
           src={imagePreview}
           alt="Profile"
             className="w-16 h-16 rounded-full object-cover flex"
            />
      {isEditing && (
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600 transition"
          aria-label="Change profile picture"
        >
          ✏️
            </button>
            )}
            </div>
          <input
          type="file"
         ref={fileInputRef}
            onChange={handleImageChange}
           accept="image/png, image/jpeg"
           className="hidden"
        />
       {/* END: New image block */}

        <div className="flex-grow">
          <h3 className="text-xl font-bold">{formData.fullname}</h3>
          <p className="text-gray-500 text-sm">{profileData.email}</p>
         </div>
         </div>
                <hr className="my-6 border-gray-300" />

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
                >
                  <DecoratedInput id="fullname" name="fullname" label="Full Name" value={formData.fullname} onChange={handleChange} disabled={!isEditing} />
                  <DecoratedInput id="phone_number" name="phone_number" label="Phone Number*" value={formData.phone_number} onChange={handleChange} disabled={!isEditing} />

                  <div>
                    <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                    <div className="relative h-8 group">
                      <DecoratedInput id="gender-base" label="" disabled={!isEditing} />
                      <select name="gender" id="gender" value={formData.gender || "M"} onChange={handleChange} disabled={!isEditing} className={`absolute inset-0 z-20 appearance-none w-full h-full bg-transparent border-none focus:outline-none px-3 text-sm ${!isEditing ? "text-gray-500 cursor-default" : "text-gray-800"}`}>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                        <option value="O">Other</option>
                      </select>
                      <FiChevronDown className="absolute top-1/2 right-3 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
                    </div>
                  </div>

                  <DecoratedInput id="alternate_phone" name="alternate_phone" label="Alternate Phone Number" value={formData.alternate_phone} placeholder="Optional" onChange={handleChange} disabled={!isEditing} />
                  {/* <DecoratedInput id="team_name" name="team_name" label="Team Name" value={profileData.team_name} readOnly className="text-gray-500 bg-gray-100 cursor-not-allowed" /> */}
                  <DecoratedInput id="team_name" name="team_name" label="Team Name" value={formData.team_name} onChange={handleChange} disabled={!isEditing} />
                  <DecoratedInput id="collegename" name="collegename" label="College" value={formData.collegename} onChange={handleChange} disabled={!isEditing} />
                  <DecoratedInput id="city" name="city" label="City" value={formData.city} onChange={handleChange} disabled={!isEditing} />
                  <DecoratedInput id="state" name="state" label="State" value={formData.state} onChange={handleChange} disabled={!isEditing} />
                  
                  <div className="md:col-span-2 flex flex-col sm:flex-row justify-end items-center gap-4 mt-4">
                    <div className="flex-grow text-left">
                      {error && <p className="text-sm text-red-500">{error}</p>}
                      {saveSuccess && <p className="text-sm text-green-500">Profile Saved Successfully!</p>}
                    </div>
                    {isEditing ? (
                      <>
                        <button type="button" onClick={handleCancelClick} className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2">
                          Cancel
                        </button>
                        <DecoratedButton type="submit" size="md" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </DecoratedButton>
                      </>
                    ) : (
                      <DecoratedButton type="button" size="md" onClick={handleEditClick}>
                        Edit Profile
                      </DecoratedButton>
                    )}
                  </div>
                </form>

                <div className="flex items-center gap-x-3 mt-8 border-t border-gray-300 pt-10">
                  <FiMail className="w-8 h-8 text-brand-red flex-shrink-0" />
                  <div>
                     <p className="text-sm font-semibold">Email Address</p>
                     <p className="text-sm text-gray-600">{profileData.email}</p>
                     <p className="text-xs text-gray-400">
                      {`Joined ${formatDistanceToNow(new Date(profileData.date_joined), { addSuffix: true })}`}
                     </p>
                  </div>
                </div>
              </div>
            )}
            {openindex.includes(2) && <MyRegistrations/>}
            {openindex.includes(3) && <AddMembers/>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;