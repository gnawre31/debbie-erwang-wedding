import React, { useState } from "react";

const FormPage = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        rsvp: null,
        additional_notes: "",
    });
    const [errors, setErrors] = useState({});

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
        if (!formData.rsvp) newErrors.rsvp = "Please select an RSVP option.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("RSVP Submitted:", formData);
            // Integrate with Notion API here
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
            <div className="max-w-lg w-full bg-white p-8 shadow-lg rounded-2xl border border-gray-200">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
                    💍 Wedding RSVP
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 placeholder-gray-400 text-gray-700"
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
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 placeholder-gray-400 text-gray-700"
                            />
                            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 placeholder-gray-400 text-gray-700"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* RSVP Buttons */}
                    <div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">Will you be attending?</p>
                        <div className="flex space-x-4">
                            <div
                                className={`border border-black rounded-lg p-4 pt-8 pb-8 w-1/2 text-center cursor-pointer transition duration-100 ${formData.rsvp
                                    ? "bg-pink-500 text-white border-pink-500"
                                    : "text-gray-400 hover:border-pink-500"
                                    }`}
                                onClick={() => handleRSVP(true)}
                            >
                                Yes, I will be there!
                            </div>
                            <div
                                className={`border border-black rounded-lg p-4 pt-8 pb-8 w-1/2 text-center cursor-pointer transition duration-100 ${formData.rsvp === false
                                    ? "bg-gray-400 text-white border-gray-400"
                                    : "text-gray-400 hover:border-pink-500"
                                    }`}
                                onClick={() => handleRSVP(false)}
                            >
                                No, I can't attend.
                            </div>
                        </div>
                        {errors.rsvp && <p className="text-red-500 text-sm mt-1">{errors.rsvp}</p>}
                    </div>

                    <p className="text-lg font-semibold text-gray-700 mb-2">You’re welcome to choose your meal options on the day of the event! If you have any dietary restrictions or allergies, please let us know in advance.</p>


                    {/* Dietary Restrictions & Other Details */}
                    <textarea
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleChange}
                        placeholder="Dietary restrictions or anything else we should know."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 bg-white text-gray-700"
                        rows="3"
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition duration-300"
                    >
                        Submit RSVP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormPage;
