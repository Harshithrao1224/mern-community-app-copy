import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../hooks/AuthProvider'; 
import axios from 'axios';
export const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const logout = async () => {
    try {
      // Send a request to the logout endpoint
      const response = await axios.post("https://localhost:4000/auth/logout", {}, {withCredentials: true});
  
      if (response.status === 200) {
        window.sessionStorage.removeItem("userID");
        window.sessionStorage.removeItem("userName");
        setIsLoggedIn(false);
        navigate("/");
        window.location.reload(); 
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.log("Logout error", error);
    }
  };
  
    
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <Link className="navbar-brand" to="/">Home</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {!isLoggedIn ? (
            <li className="nav-item">
              <Link className="btn btn-primary" to="/login">Login</Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/create-post">New Post</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/saved-posts">Saved Posts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/myposts">My Posts</Link>
              </li>
              <li className="nav-item d-flex justify-content-center align-items-center">
                <button
                  className={`btn btn-danger ${!isLoggedIn ? 'd-none' : ''}`}
                  onClick={() => logout()}
                >
                  Log out, {window.sessionStorage.getItem("userName")}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
