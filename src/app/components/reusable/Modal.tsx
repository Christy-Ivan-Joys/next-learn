import React from "react";

interface ModalButton {
    label: string;
    onClick: () => void;
    className?: string;
}

interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    titleAlign?: "left" | "center" | "right";
    children: React.ReactNode;
    buttons?: ModalButton[];
    buttonAlign?: "left" | "center" | "right";
    contentClassName?: string;
    loading?: boolean
}

export default function ReusableModal({
    isOpen,
    onClose,
    title,
    titleAlign = "left",
    children,
    buttons = [],
    buttonAlign = "right",
    contentClassName = "",
    loading = false
}: ReusableModalProps) {

    if (!isOpen) return null;

    const alignTitle = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    const alignButtons = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]"></div>

            <div className="relative bg-white text-sm  rounded-lg p-6 shadow-lg w-auto max-w-full inline-block">
                <button
                    className="absolute top-3 right-3  text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>
                {title && (
                    <h2 className={`text-md text-gray-800 font-semibold mb-4 border-b pb-2 border-gray-200 ${alignTitle[titleAlign]}`}>
                        {title}
                    </h2>
                )}
                <div className={`mb-6 ${contentClassName}`}>
                    {children}
                </div>
                {buttons.length > 0 && (
                    <div className={`flex gap-3 ${alignButtons[buttonAlign]}`}>
                        {buttons.map((btn, i) => (
                            <button
                                key={i}
                                onClick={!loading ? btn.onClick : undefined}
                                disabled={loading}
                                className={`px-4 py-2 rounded flex items-center justify-center gap-2 
                    ${btn.className || "bg-blue-600 text-white"}
                    ${loading ? "opacity-70 cursor-not-allowed" : ""}
                `}
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                )}
                                {btn.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
