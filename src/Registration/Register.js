import { useState, useEffect, useRef, useContext } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Firebase/firebase";
import "../styles/Registration.css";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Database/database";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const USER_REGEX = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX = /^(?=.*\d).{6,24}$/;

const Register = () => {
  const userRef = useRef();
  const errorRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMsg, setErrorMsg] = useState("ass");
  const [success, setSuccess] = useState(false);

  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    setValidPwd(PASSWORD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrorMsg("");
  }, [email, user, pwd, matchPwd]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PASSWORD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);
    if (!v1 || !v2 || !v3) {
      setErrorMsg("Invalid Entry");
      return;
    }

    try {
      const userRegister = await createUserWithEmailAndPassword(
        auth,
        email,
        pwd
      );
      await updateProfile(userRegister.user, {
        displayName: user,
      });
      const userLogin = await signInWithEmailAndPassword(auth, email, pwd);
      dispatch({ type: "LOGIN", payload: userLogin });
      await setDoc(doc(db, "lists", userLogin.user.uid), {
        lists: [],
        armyNames: [],
      });
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser("");
      setPwd("");
      setMatchPwd("");
      setEmail("");
      navigate("/");
    } catch (error) {
      console.log(error.message);
      if (error.message === "Firebase: Error (auth/email-already-in-use).")
      setErrorMsg("Podany adres e-mail jest już w użyciu.")
    }
  };


  return (
      <div className="registration-container page-section">
        <div className="registration">
          <p ref={errorRef} className={errorMsg ? "errmsg" : "offscreen"}>
            {errorMsg}
          </p>
          
          <h1 className="registration-title">Stwórz konto</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Nazwa użytkownika:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              className="registration-input"
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 do 20 znaków.
              <br />
              Dozwolone jedynie litery i cyfry.
            </p>

            <label htmlFor="email">
              Adres e-mail:
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              className="registration-input"
              type="text"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id="uidnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Niepoprawny adres e-mail.
            </p>

            <label htmlFor="password">
              Hasło:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              className="registration-input"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              6 do 24 znaków.
              <br />
              Musi zawierać przynajmniej jedną liczbę.
            </p>

            <label htmlFor="confirm_pwd">
              Potwierdź hasło:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              className="registration-input"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Hasła się nie zgadzają.
            </p>

            <button
              className="registration-button"
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Rejestracja
            </button>
          </form>
        </div>
      </div>
  );
};

export default Register;
