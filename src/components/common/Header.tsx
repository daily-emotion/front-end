import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const accessToken = localStorage.getItem("Authorization");
    
    if (!accessToken) {
        alert("로그인 상태가 아닙니다. 로그인 후 이용해주세요.");
        navigate("/");
    }

    const response = axios.get(``, {
        headers: { Authorization: accessToken}
    }) 

    // return (
    //     // 로고 (상단 중앙)
    //     // 
    // )
}