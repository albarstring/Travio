// src/components/Login.jsx
import { useState } from "react";
import { loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");  
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      const user = loginUser(email, password);
      setMessage(`Selamat datang, ${user.name}!`);
      setTimeout(()=> navigate("/home"))
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Masuk</button>
      <p>{message}</p>

      <p>belum punya akun ? 
        <Link to="/Register">Daftar disini
        </Link>
      </p>
    </div>
  );
}

export default Login;
