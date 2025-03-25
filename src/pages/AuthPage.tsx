import { useEffect, useState } from "react";
import "../components/auth/card.css";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import { Alert, Link, Snackbar, Typography } from "@mui/material";

import skylabLogoPurple from "/skylabLogoPurple.svg";
import skylabLogoWingSmall from "/skylabLogoWingSmall.svg";
import skylabLogoWingLarge from "/skylabLogoWingLarge.svg";
import { useNavigate } from "react-router-dom";

import { loginThunk, signupThunk } from "../store/authSlice";
// import { setError, setLoading } from "../store/formsSlice";
import { useAppDispatch, useAppSelector } from "../store/typedHooks";

export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loginLoading = useAppSelector((state) => state.auth.loginLoading);
  const loginError = useAppSelector((state) => state.auth.loginError);
  const signupLoading = useAppSelector((state) => state.auth.signupLoading);
  const signupError = useAppSelector((state) => state.auth.signupError);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  // const loading = useSelector((state: RootState) => state.forms.loading);
  // const error = useSelector((state: RootState) => state.forms.error);

  useEffect(() => {
    const storedCardState = sessionStorage.getItem("authCardSide");
    if (storedCardState) {
      setIsFlipped(storedCardState === "front");
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token && isAuthenticated) {
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  }, [isAuthenticated, navigate]);

  const handleFlip = () => {
    setIsAnimate(true);
    setIsFlipped((prev) => !prev);
    const newState = !isFlipped ? "front" : "back";
    sessionStorage.setItem("authCardSide", newState);
  };

  const handleAnimationEnd = () => {
    setIsAnimate(false);
  };
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await dispatch(loginThunk(data)).unwrap();
      showSnackbar("Login successful!", "success");
      // setTimeout(() => {
      //   navigate("/");
      // }, 1500);
    } catch (error) {
      console.log("login error: ", loginError);
      // const errorMessage =
      //   typeof error === "string" ? error : "Login failed, please try again.";

      // showSnackbar(errorMessage, "error");
      console.error("Login failed:", error);
      // setError("Invalid email or password");
    }
  };

  const handleSignup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await dispatch(signupThunk(data)).unwrap();
      // Login automatically after signup
      await dispatch(
        loginThunk({ email: data.email, password: data.password })
      ).unwrap();
      showSnackbar(signupError || "Signup successful!", "success");
      // setTimeout(() => {
      //   navigate("/");
      // }, 1500);
    } catch (error) {
      console.error("Signup failed:", error);
      // const errorMessage =
      //   typeof error === "string" ? error : "Signup failed. Please try again.";
      // showSnackbar(errorMessage, "error");
    }
  };

  // Add these useEffects to show error messages when state changes
  useEffect(() => {
    if (loginError) {
      showSnackbar(loginError, "error");
    }
  }, [loginError]);

  useEffect(() => {
    if (signupError) {
      showSnackbar(signupError, "error");
    }
  }, [signupError]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <div className="flip-card relative w-[80%] sm:w-[70%] md:w-[60%] lg:w-1/2 xl:w-[40%] h-[60%] sm:h-[65%] lg:h-[70%]">
        {/* <div className="bg-black w-full h-full border border-solid border-red-500"> */}
        <div
          className={`${
            isFlipped ? "flipped" : "not-flipped"
          } back-side absolute w-full h-full flex flex-col gap-2 justify-center items-center shadow-2xl rounded-2xl  bg-black`}
        >
          <Signup onSubmit={handleSignup} signupLoading={signupLoading} />

          <Typography color="secondary.main">
            Already have an account?{" "}
            <Link
              onClick={handleFlip}
              color="primary"
              className="hover:cursor-pointer"
            >
              Log In
            </Link>
          </Typography>
        </div>
        <div
          className={`${
            isFlipped ? "flipped" : "not-flipped"
          } front-side absolute w-full h-full flex flex-col gap-2 justify-center items-center shadow-2xl rounded-2xl bg-black`}
        >
          <Login onSubmit={handleLogin} loginLoading={loginLoading} />
          <Typography
            color="secondary.main"
            sx={{
              fontSize: "0.8rem",
              lineHeight: "1.75rem",
              "@media (min-width:768px)": {
                fontSize: "1rem",
                lineHeight: "1.75rem",
              },
              "@media (min-width:1024px)": {
                fontSize: "1.1rem",
                lineHeight: "1.75rem",
              },
            }}
          >
            Don't have an account?{" "}
            <Link
              onClick={handleFlip}
              color="primary"
              className="hover:cursor-pointer"
            >
              Signup
            </Link>
          </Typography>
        </div>
        <img
          src={skylabLogoPurple}
          alt="skylab logo"
          // className={`absolute inset-x-0 top-[-${imagePosition}px] -z-20 w-auto mx-auto`}
          className={`${
            isAnimate && "skylabLogoPurpleAnimation"
          } transition-transform absolute -top-[78px] md:-top-[80px] inset-x-0 mx-auto -z-20 w-auto scale-75 md:scale-90`}
          onAnimationEnd={handleAnimationEnd}
          // style={{ top: `-${imagePosition}px` }}
        />
        <img
          src={skylabLogoWingSmall}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabWingSmallTopLeftAnimation"
          } absolute -top-8 md:-top-9 md:-left-9 -left-8 -z-20 w-auto mx-auto scale-75 md:scale-100`}
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          src={skylabLogoWingSmall}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabWingSmallTopRightAnimation"
          } absolute -top-8 md:-top-9 md:-right-9 -right-8 -z-20 w-auto mx-auto rotate-90 scale-75 md:scale-100`}
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          src={skylabLogoWingSmall}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabWingSmallBottomRightAnimation"
          } absolute -bottom-8 md:-bottom-9 md:-right-9 -right-8 -z-20 w-auto mx-auto rotate-180 scale-75 md:scale-100`}
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          src={skylabLogoWingSmall}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabWingSmallBottomLeftAnimation"
          } absolute -bottom-8 md:-bottom-9 md:-left-9 -left-8 -z-20 w-auto mx-auto -rotate-90 scale-75 md:scale-100`}
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          src={skylabLogoWingLarge}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabLargeWingLeftAnimation"
          } absolute -left-16 sm:-left-[72px] transform top-1/2 -translate-y-1/2 -z-20 w-auto mx-auto scale-50 sm:scale-75`}
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          src={skylabLogoWingLarge}
          alt="skylab logo"
          className={`${
            isAnimate && "skylabLargeWingRightAnimation"
          } absolute -right-16 sm:-right-[72px] top-1/2 transform -translate-y-1/2 -z-20 w-auto mx-auto rotate-180 scale-50 sm:scale-75`}
          onAnimationEnd={handleAnimationEnd}
        />
      </div>

      {/* </div> */}
    </div>
  );
}
