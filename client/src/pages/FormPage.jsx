import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const COOKIE_NAME = "rsvpData";

const FormPage = () => {
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

        if (!formData.first_name.trim()) newErrors.first_name = "Please enter your first name.";
        if (!formData.last_name.trim()) newErrors.last_name = "Please enter your last name.";
        if (!formData.email.trim()) {
            newErrors.email = "Please enter an email address.";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (formData.rsvp === null) newErrors.rsvp = "Please select an RSVP option.";

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
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#f5efe7] flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-2xl border border-gray-200">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                    RSVP
                </h2>

                {showForm ? (
                    loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4A2A05] border-opacity-50"></div>
                            <p className="mt-4 text-[#4A2A05] font-medium">Submitting RSVP...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        name="first_name"
                                        placeholder="First Name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4A2A05] focus:border-[#4A2A05] placeholder-gray-400 text-gray-700 transition duration-300"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                                </div>
                                <div className="w-1/2">
                                    <input
                                        type="text"
                                        name="last_name"
                                        placeholder="Last Name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4A2A05] focus:border-[#4A2A05] placeholder-gray-400 text-gray-700 transition duration-300"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4A2A05] focus:border-[#4A2A05] placeholder-gray-400 text-gray-700 transition duration-300"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-gray-700 mb-2">Will you be attending?</p>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        className={`w-1/2 p-3 rounded-lg border border-gray-400 ${formData.rsvp
                                            ? "bg-[#4A2A05] text-white border-[#4A2A05]"
                                            : "text-gray-700 hover:border-[#4A2A05] hover:text-[#4A2A05]"
                                            } transition duration-300`}
                                        onClick={() => handleRSVP(true)}
                                    >
                                        Yes, I will be there!
                                    </button>
                                    <button
                                        type="button"
                                        className={`w-1/2 p-3 rounded-lg border border-gray-400 ${formData.rsvp === false
                                            ? "bg-gray-400 text-white border-gray-400"
                                            : "text-gray-700 hover:border-[#4A2A05] hover:text-[#4A2A05]"
                                            } transition duration-300`}
                                        onClick={() => handleRSVP(false)}
                                    >
                                        No, I can't attend.
                                    </button>
                                </div>
                                {errors.rsvp && <p className="text-red-500 text-sm mt-1">{errors.rsvp}</p>}
                            </div>

                            <textarea
                                name="additional_notes"
                                value={formData.additional_notes}
                                onChange={handleChange}
                                placeholder="Dietary restrictions or anything else we should know."
                                className="w-full p-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#4A2A05] focus:border-[#4A2A05] bg-white text-gray-700 transition duration-300"
                                rows="3"
                            />

                            <button
                                type="submit"
                                className="w-full bg-[#4A2A05] text-white p-3 rounded-lg hover:bg-[#4A2A05] transition duration-300"
                            >
                                Submit RSVP
                            </button>
                        </form>
                    )
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600 text-lg font-medium">
                            Thank you for your RSVP, <span className="font-semibold">{formData.first_name}</span>.
                            Click below if you'd like to edit your response.
                        </p>
                        <button onClick={() => setShowForm(true)} className="mt-4 bg-[#4A2A05] text-white p-3 rounded-lg hover:bg-[#4A2A05] transition duration-300">
                            Edit RSVP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormPage;
