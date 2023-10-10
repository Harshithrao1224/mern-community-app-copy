import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const logout = () => {
        setCookies("access_token", "");
        window.sessionStorage.removeItem("userID");
        window.sessionStorage.removeItem("username");
        navigate("/");
        window.location.reload(); 
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
                    {!cookies.access_token ? (
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
                            <li className="nav-item d-flex justify-content-center align-items-center">
                                <button
                                    className={`btn btn-danger ${!cookies.access_token ? 'd-none' : ''}`}
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
