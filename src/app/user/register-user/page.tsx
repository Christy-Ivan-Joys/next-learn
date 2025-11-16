"use client";

import { useEffect, useState } from "react";
import MainLayout from "../../components/auth/LoginLayout";
import TextInput from "@/app/components/reusable/input/TextInput";
import { createProfile } from "@/app/service/auth.service";
import { useRouter } from "next/navigation";
import { TokenService } from "@/app/service/token.service";

export default function CreateUserPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        qualification: "",
        photoFile: null as File | null,
        photoPreview: "",
    });

    const [loading, setLoading] = useState(false);
    const phoneNumber = typeof window !== "undefined" ? localStorage.getItem("phoneNumber") : null;

    useEffect(() => {
        if (!phoneNumber) {
            router.push("/auth/login");
        }
    }, []);

    const handleChange = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            handleChange("photoFile", file);
            handleChange("photoPreview", preview);
        }
    };

    const onSubmit = async () => {
        if (!form.photoFile) return alert("Profile photo is required!");
        if (!form.name || !form.qualification)
            return alert("Please fill all required fields");

        setLoading(true);

        try {
            const fd = new FormData();
            fd.append("mobile", phoneNumber || "");
            fd.append("name", form.name);
            fd.append("email", form.email);
            fd.append("qualification", form.qualification);
            fd.append("profile_image", form.photoFile);

            const res = await createProfile(fd);

            if (res.success) {
                TokenService.setAccessToken(res.access_token);
                TokenService.setRefreshToken(res.refresh_token);
                router.push("/exam/instruction");
            } else {
                alert(res.message || "Failed to create profile");
            }
        } catch (err) {
            alert("Something went wrong!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
                
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 self-start">
                    Add your details
                </h1>

                <div className="mb-10 flex flex-col items-center">
                    <label className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                        {form.photoPreview ? (
                            <img
                                src={form.photoPreview}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <img src="/images/cameraIcon.png" className="w-8 h-8 sm:w-10 sm:h-10" />
                                <span className="text-gray-500 mt-2 text-xs sm:text-sm text-center">
                                    Add your profile picture
                                </span>
                            </>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handlePhotoUpload}
                        />
                    </label>
                </div>

                <div className="w-full max-w-sm">
                    <TextInput
                        label="Name"
                        required
                        value={form.name}
                        onChange={(value) => handleChange("name", value)}
                    />

                    <div className="my-6">
                        <TextInput
                            label="Email"
                            value={form.email}
                            onChange={(value) => handleChange("email", value)}
                        />
                    </div>

                    <TextInput
                        label="Qualification"
                        required
                        value={form.qualification}
                        onChange={(value) => handleChange("qualification", value)}
                    />

                    <button
                        onClick={onSubmit}
                        className="w-full bg-login-rectangle text-white font-medium text-sm sm:text-base py-3 mt-6 rounded-lg transition duration-200"
                    >
                        {loading ? "Loading..." : "Get Started"}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
