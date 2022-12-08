import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  const userRef = useRef();
  const errorRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || pwd === "") {
      setErrorMsg("Invalid Entry");
      setError(true);
      alert("fuck you");
      return;
    }

    try {
      const userLogin = await signInWithEmailAndPassword(auth, email, pwd);
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      dispatch({ type: "LOGIN", payload: userLogin });
      setPwd("");
      setEmail("");
      navigate("/");
    } catch (error) {
      setError(true);
    }
  };

  return (
      <div className="registration-container page-section">
        <div className="registration">
          <p ref={errorRef} className={errorMsg ? "errmsg" : "offscreen"}>
            {errorMsg}
          </p>
          <h1 className="registration-title">Logowanie</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Adres e-mail:</label>
            <input
              className="registration-input"
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="password">Hasło:</label>
            <input
              className="registration-input"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              autoComplete="off"
            />

            <button
              className="registration-button"
              disabled={email === "" || pwd === "" ? true : false}
            >
              Zaloguj się
            </button>
          </form>

          <div className="registration-text">
            {error && (
              <span className="error-message">
                Niewłaściwy e-mail lub hasło.
              </span>
            )}
            <p>
              Nie masz jeszcze konta?{" "}
              <Link style={{ textDecoration: "none" }} to="/register">
                <span className="link-text">Zarejestruj się</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Login;
