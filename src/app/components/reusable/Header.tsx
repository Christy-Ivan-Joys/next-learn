import { FC } from "react";

interface HeaderProps {
    logo: string;
    onLogout?: () => void;
}

const Header: FC<HeaderProps> = ({ logo, onLogout }) => {
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            console.log("Logged out!");
        }
    };

    return (
        <header className="bg-white shadow-sm border-b relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-32 h-10" />
                <button
                    onClick={handleLogout}
                    className="absolute right-4 bg-primary-button text-white px-4 py-2 rounded hover:bg-cyan-900 transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
