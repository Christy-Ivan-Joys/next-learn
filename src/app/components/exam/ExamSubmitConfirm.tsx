import ReusableModal from "../reusable/Modal";

export default function ExamSubmitConfirm({
    isOpen,
    onClose,
    onConfirm,
    stats,
    loading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    stats: {
        remainingTime: string;
        totalQuestions: number;
        answered: number;
        marked: number;
    };
    loading:boolean
}) {
    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={onClose}
            loading={loading}
            title="Are you sure you want to submit the test?"
            titleAlign="left"
            contentClassName=""
            buttons={[
                { label: "Submit Test", onClick: onConfirm, className: "bg-login-rectangle w-full rounded-md" }
            ]}
            buttonAlign="center"
        >
            <div className="space-y-3 text-gray-800">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                        <img src="/images/timerIcon.png" className="w-6 h-6" alt="" />
                        Remaining Time:
                    </span>
                    <span>{stats.remainingTime}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                        <img src="/images/totalIcon.png" className="w-6 h-6" alt="" />
                        Total Questions:
                    </span>
                    <span>{stats.totalQuestions}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                        <img src="/images/answeredIcon.png" className="w-6 h-6" alt="" />
                        Questions Answered:
                    </span>
                    <span>{String(stats.answered).padStart(3, "0")}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-3">
                        <img src="/images/markedIcon.png" className="w-6 h-6" alt="" />
                        Marked for review:
                    </span>
                    <span>{String(stats.marked).padStart(3, "0")}</span>
                </div>
            </div>
        </ReusableModal>
    );
}
