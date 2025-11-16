import api from "./api";
import { TokenService } from "./token.service";



export async function sendOtp(mobile: string) {
    const formData = new FormData();
    formData.append("mobile", mobile);

    const res = await api.post("/auth/send-otp", formData);
    console.log(res, ' sent otp response in the service ')
    return res.data;
}

export async function verifyOtp(mobile: string, otp: string) {
    const formData = new FormData();
    formData.append("mobile", mobile);
    formData.append("otp", otp);

    const res = await api.post("/auth/verify-otp", formData);
    console.log(res,'verify otp response service')
    return res.data;
}

export async function createProfile(data: FormData) {
    const res = await api.post("/auth/create-profile", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

export async function logout() {
    const res = await api.post("/auth/logout");
    TokenService.clearTokens();
    return res.data;
}