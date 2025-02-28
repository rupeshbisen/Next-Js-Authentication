import registerUserType from "@/types/registerUserType";

export const registerNewUser = async (formData: registerUserType) => {
    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const finalData = await response.json();
        return finalData;

    } catch (e) {
        console.log("error", e)
    }
}