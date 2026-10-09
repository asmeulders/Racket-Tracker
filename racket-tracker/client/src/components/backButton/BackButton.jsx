import { useNavigate } from "react-router-dom";

import "./BackButton.css";

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
            <i class="fa-solid fa-arrow-left-long"></i>
        </button>
    )
}