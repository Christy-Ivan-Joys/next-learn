import Header from "../reusable/Header";
import { logout } from "../../service/auth.service";
import { useRouter } from "next/navigation";
import ProtectRoute from "@/app/auth/protect/page";


export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const LogoutUser = () => {
        logout()
        router.push("/auth/login")
    }

    return (
        <ProtectRoute>
            <div className="min-h-screen flex flex-col bg-white">
                <Header logo="/images/headerLogo.png" onLogout={LogoutUser} />
                <main className="flex-1">{children}</main>
            </div>
        </ProtectRoute>
    )
}