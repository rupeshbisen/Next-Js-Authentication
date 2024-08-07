
export const sendOTPRequest = async (userName: { userName: string; }) => {
    try {
        const response = await fetch("/api/forgot-password/sendotp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userName),
        });
        const data = await response.json();
        return data;
    } catch (e) {
        throw new Error("Error");
    }
}

export const setPassword = async (passwordData: { userName: string; password: string; otp: Number; }) => {
    try {
        const response = await fetch("/api/forgot-password/setpassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(passwordData),
        });
        const data = await response.json();
        return data;
    } catch (e) {
        throw new Error("Error");
    }
} 