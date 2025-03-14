

export const checkPassword = (password) => {
    return password === import.meta.env.VITE_PASSWORD;
}