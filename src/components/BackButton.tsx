import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface BackButtonProps {
    fallback: string;
}

export default function BackButton({ fallback }: BackButtonProps) {
    const navigate = useNavigate();
    const location = useLocation();

    function handleBack() {
        if (location.state?.from) {
            navigate(-1);
        } else {
            navigate(fallback, { replace: true });
        }
    }

    return (
        <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="cursor-pointer text-gray-400 transition-colors hover:text-orange-400"
        >
            <ArrowLeft size={24} />
        </button>
    );
}