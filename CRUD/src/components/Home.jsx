import { useNavigate } from "react-router-dom";
import { getLoggedInUser, logoutUser } from "../services/authServices";
import { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    const loggedUser = getLoggedInUser();
    if(loggedUser){
        setUser(loggedUser);
    }
    else{
        navigate('/login');
    }
  }, [navigate])
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };
  function getAllUser(users){
    getAllUser();
  }
  return (
    <div>
      <h2>Selamat Datang di Home Page 🎉</h2>
      <p>HALO {user ? user.name : "Pengguna"}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
