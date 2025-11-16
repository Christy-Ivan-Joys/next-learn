"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RequireAuthProps {
    children: React.ReactNode;
    getToken: () => string | null;
    logout: () => void;
    redirectTo: string;
    LoadingComponent?: React.ReactNode;
}

export default function RequireAuth({
    children,
    getToken,
    logout,
    redirectTo,
    LoadingComponent = null
}: RequireAuthProps) {

    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            logout()
            router.replace(redirectTo);
            return;
        }
        setAllowed(true);
    }, []);

    if (!allowed) return <>{LoadingComponent}</>;
    return <>{children}</>;
}
