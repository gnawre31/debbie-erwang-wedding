import useAuthStore from "../stores/useAuthStore";

const HomePage = () => {
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
                <h1 className="text-3xl font-bold text-gray-800">Hello World</h1>
                <button
                    onClick={logout}
                    className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition"
                >
                    Clear Cookies
                </button>
            </div>
        </div>
    );
};

export default HomePage;
