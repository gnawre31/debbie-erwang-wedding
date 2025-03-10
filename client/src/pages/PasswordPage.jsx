import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

const PASSWORD = "test"

const PasswordPage = () => {
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === PASSWORD) {
            login(password);
            navigate("/");
        } else {
            setShowModal(true); // Show modal if the password is incorrect
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                    Enter Password
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 w-full rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter password"
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-md transition"
                    >
                        Submit
                    </button>
                </form>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-semibold text-black mb-2">Incorrect Password</h2>
                        <p className="mb-4 text-gray-700">Please try again or contact debbie.erwang@gmail.com</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PasswordPage;
