import loginUserTypes from "@/types/loginUserTypes";

export const login = async (formData: loginUserTypes) => {
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    } catch (e) {
        throw new Error("Error");
    }
} 