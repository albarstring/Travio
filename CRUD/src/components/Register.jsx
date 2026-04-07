import { useState } from "react";
import { registerUsers } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = () => {
        try{
            registerUsers(name, email, password);
            setMessage("Register berhasil! Silahkan Login.");
            setTimeout(()=> navigate("/login"), 1000);
        } catch(err){
            setMessage(err.message);
        }
    };

    return(
        <div>
            <h2>Register</h2>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <input type="text" placeholder="Nama" value={name} onChange ={(e) => setName(e.target.value)} /> <br />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> <br />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button onClick={handleRegister}>
                Daftar
            </button>
            <p>{message}</p>
        </div>
        </div>
    );
}

export default Register;