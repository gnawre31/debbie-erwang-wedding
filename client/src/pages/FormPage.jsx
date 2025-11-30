import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft for the back button

const COOKIE_NAME = "rsvpData";

const FormPage = () => {
    const navigate = useNavigate(); // Initialize navigate hook

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        rsvp: null,
        additional_notes: "",
    });
    const [errors, setErrors] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [isCleared, setIsCleared] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedData = Cookies.get(COOKIE_NAME);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData(parsedData);
            setShowForm(false);
        } else {
            setShowForm(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "",
            }));
        }
    };

    const handleRSVP = (value) => {
        setFormData({
            ...formData,
            rsvp: value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.first_name.trim()) newErrors.first_name = "Required"; // Shortened for elegance
        if (!formData.last_name.trim()) newErrors.last_name = "Required";
        if (!formData.email.trim()) {
            newErrors.email = "Required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email";
        }
        if (formData.rsvp === null) newErrors.rsvp = "Please make a selection";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.post("https://1arde36ene.execute-api.us-east-1.amazonaws.com/Prod/rsvp", formData);
            Cookies.set(COOKIE_NAME, JSON.stringify(formData), { expires: 180 });
            setIsCleared(false);
            setShowForm(false);

            await axios.post("https://1arde36ene.execute-api.us-east-1.amazonaws.com/Prod/confirm", formData)
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to navigate back to the home page (which is '/')
    const handleBackClick = () => {
        navigate('/');
    };

    // Styles for consistency
    const inputClasses = "w-full bg-transparent border-b border-stone-300 py-3 text-stone-700 focus:outline-none focus:border-[#4A2A05] transition-colors duration-300 placeholder-stone-400 font-sans font-light";
    const labelClasses = "block text-sm uppercase tracking-widest text-stone-500 mb-1 font-sans";

    return (
        // Changed background to a warm stone/paper color
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-8 font-serif">

            {/* The "Card" - Added relative positioning for decorative border */}
            <div className="relative max-w-xl w-full bg-white shadow-xl px-8 py-12 md:p-14">

                {/* Decorative Inner Border (The "Wedding Invitation" look) */}
                <div className="absolute top-3 left-3 right-3 bottom-3 border border-stone-200 pointer-events-none"></div>

                <div className="relative z-10">

                    {/* New BACK button: Absolutely positioned top-right, visible only after submission */}
                    {!showForm && (
                        <button
                            onClick={handleBackClick}
                            // Positioned absolutely within the z-10 content container
                            className="absolute top-0 right-0 flex items-center gap-1 text-xs uppercase tracking-widest text-stone-500 hover:text-[#4A2A05] transition-colors"
                        >
                            <ArrowLeft size={16} /> BACK
                        </button>
                    )}

                    <div className="text-center mb-10">
                        <p className="text-[#4A2A05] uppercase tracking-[0.2em] text-xs mb-3">The Wedding of</p>
                        <h2 className="text-4xl md:text-5xl text-[#4A2A05] mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                            Debbie & Erwang
                        </h2>
                        <div className="h-px w-16 bg-[#4A2A05] mx-auto mt-6 opacity-30"></div>
                        <p className="mt-4 text-stone-500 italic">Details will be shared by debbie.erwang@gmail.com. Feel free to reach out for any questions!</p>
                        <p className="mt-4 text-stone-500 italic">If you do not receive a confirmation email, check your spam folder.</p>
                    </div>

                    {showForm ? (
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4A2A05]"></div>
                                <p className="text-stone-600 italic font-light tracking-wide">Sending your response...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="w-full md:w-1/2">
                                        <input
                                            type="text"
                                            name="first_name"
                                            placeholder="First Name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                        {errors.first_name && <p className="text-red-400 text-xs mt-1 italic">{errors.first_name}</p>}
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <input
                                            type="text"
                                            name="last_name"
                                            placeholder="Last Name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        />
                                        {errors.last_name && <p className="text-red-400 text-xs mt-1 italic">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1 italic">{errors.email}</p>}
                                </div>

                                <div className="pt-4">
                                    <p className="text-center text-lg text-[#4A2A05] mb-6 italic">Will you be attending?</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            type="button"
                                            className={`flex-1 py-3 px-4 border transition-all duration-300 font-sans tracking-wide text-sm uppercase ${formData.rsvp === true
                                                ? "bg-[#4A2A05] text-white border-[#4A2A05]"
                                                : "bg-transparent text-stone-600 border-stone-300 hover:border-[#4A2A05] hover:text-[#4A2A05]"
                                                }`}
                                            onClick={() => handleRSVP(true)}
                                        >
                                            Joyfully Accept
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex-1 py-3 px-4 border transition-all duration-300 font-sans tracking-wide text-sm uppercase ${formData.rsvp === false
                                                ? "bg-stone-500 text-white border-stone-500"
                                                : "bg-transparent text-stone-600 border-stone-300 hover:border-stone-500 hover:text-stone-500"
                                                }`}
                                            onClick={() => handleRSVP(false)}
                                        >
                                            Regretfully Decline
                                        </button>
                                    </div>
                                    {errors.rsvp && <p className="text-center text-red-400 text-xs mt-2 italic">{errors.rsvp}</p>}
                                </div>

                                <div>
                                    <label className={labelClasses}>Additional Notes</label>
                                    <textarea
                                        name="additional_notes"
                                        value={formData.additional_notes}
                                        onChange={handleChange}
                                        placeholder="Dietary restrictions or a note for the couple..."
                                        className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-[#4A2A05] focus:outline-none text-stone-700 transition duration-300 min-h-[100px] font-sans font-light text-sm"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#4A2A05] text-white py-4 px-6 uppercase tracking-[0.2em] text-xs hover:bg-[#3d2204] transition duration-500 ease-in-out shadow-sm hover:shadow-md"
                                    >
                                        Confirm Response
                                    </button>
                                </div>
                            </form>
                        )
                    ) : (
                        // Confirmation message - adjusted top padding
                        <div className="text-center pb-12 animate-fade-in relative">
                            <div className="text-4xl mb-4 text-[#4A2A05]">❦</div>
                            <h3 className="text-2xl text-gray-800 mb-2 font-serif">Thank you, {formData.first_name}</h3>
                            <p className="text-stone-600 font-light italic mb-8">
                                Your response has been received.
                            </p>
                            {/* Existing Edit button */}
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-xs uppercase tracking-widest text-[#4A2A05] border-b border-[#4A2A05] pb-1 hover:opacity-70 transition-opacity"
                            >
                                Edit Response
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormPage;