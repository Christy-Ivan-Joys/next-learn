import RequireAuth from "@/app/components/auth/Protect";
import LoadingScreen from "@/app/components/reusable/Loader";
import { logout } from "@/app/service/auth.service";
import { TokenService } from "@/app/service/token.service";


export default function ProtectRoute({ children }: { children: React.ReactNode }) {
    return (
        <RequireAuth getToken={TokenService.getAccessToken} logout={logout} redirectTo="/auth/login" LoadingComponent={<LoadingScreen/>}>
            {children}
        </RequireAuth>
    )
}