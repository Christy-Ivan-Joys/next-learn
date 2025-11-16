import { QuestionType } from "@/app/types/test.types";
import ReusableModal from "../reusable/Modal";

interface QuestionDetailsModalProps {
    open:boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedQuestion:QuestionType | null;

}
export default function QuestionDetailsModal({open, setOpen, selectedQuestion}:QuestionDetailsModalProps) {

    return (
        <ReusableModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Comprehensive Paragraph"
            contentClassName="max-w-2xl"
            titleAlign="left"
            buttons={[
                {
                    label: "Minimize",
                    onClick: () => setOpen(false),
                    className: "bg-gray-700 text-sm text-white px-12 text-center"
                }
            ]}
            buttonAlign="right"
        >
            {selectedQuestion && (
                <div className="flex flex-col items-end justify-end min-h-full">
                    <div className="space-y-3 text-left">
                        {selectedQuestion.comprehension && (
                            <p className="text-gray-700 text-sm">
                                {selectedQuestion.comprehension}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </ReusableModal>
    )
}