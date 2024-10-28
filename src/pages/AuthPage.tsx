import { ThemeProvider } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

import "../components/auth/card.css";
import Theme from "../theme/Theme";

import skylabLogoPurple from "/skylabLogoPurple.svg";
import skylabLogoWingSmall from "/skylabLogoWingSmall.svg";
import skylabLogoWingLarge from "/skylabLogoWingLarge.svg";

// import { Card, CardContent } from "@mui/material";

const AuthPage = () => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [imagePosition, setImagePosition] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedCardState = localStorage.getItem("authCardSide");
    if (storedCardState) {
      setIsFlipped(storedCardState === "front");
    }
  }, []);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    const newState = !isFlipped ? "front" : "back";
    localStorage.setItem("authCardSide", newState);
  };
  const handleLogin = (data: {
    email: string;
    password: string;
    // remember: boolean;
  }) => {
    console.log("Login Data:", data);
    // send a request to  authentication API
  };
  const handleSignup = (data: {
    email: string;
    password: string;
    confirmPassword: string;
    // remember: boolean;
  }) => {
    console.log("Signup Data:", data);
    // send a request to your authentication API
  };
  useEffect(() => {
    const updateImagePosition = () => {
      if (sectionRef.current) {
        const height = sectionRef.current.clientHeight;
        setImagePosition(height * 0.175);
      }
    };

    updateImagePosition();
    window.addEventListener("resize", updateImagePosition);

    return () => {
      window.removeEventListener("resize", updateImagePosition);
    };
  }, [sectionRef]);

  //   const sectionHeight = sectionRef.current ? sectionRef.current.clientHeight : 0;
  //   const imagePosition = sectionHeight * 0.16;
  return (
    <ThemeProvider theme={Theme}>
      <div className="w-full h-screen flex justify-center items-center overflow-hidden preserve-3d">
        {/* <Card className="w-1/2 h-full"> */}
        {/* <CardContent
          className={`card ${
            isFlipped && "flipped"
          } w-full border border-solid border-purple rounded-xl shadow-2xl
               bg-black`}
        > */}
        {/* <div
              className={`transform transition-transform duration-500 preserve-3d ${
                isFlipped ? "flipped" : ""
              }`}
            > */}
        {/* <div className="front"> */}
        <section
          ref={sectionRef}
          className={`card bg-black border z-20 border-purple flex justify-center items-center rounded-xl max-w-1/2 max-h-[80%]  ${
            isFlipped
              ? "flipped lg:w-[40%] lg:h-[75%] md:w-[50%] md:h-1/2"
              : "lg:w-[35%] lg:h-[60%] md:w-[45%] md:h-[55%] sm:w-[55%] w-3/4 h-[55%]"
          }
         `}
        >
          {/* <div className="-z-20 absolute inset-x-0 top-[-8%] w-full  h-1/3"> */}
          <img
            src={skylabLogoPurple}
            alt="skylab logo"
            // className={`absolute inset-x-0 top-[-${imagePosition}px] -z-20 w-auto mx-auto`}
            className="absolute inset-x-0 mx-auto -z-20 w-auto"
            style={{ top: `-${imagePosition}px` }}
          />
          <img
            src={skylabLogoWingSmall}
            alt="skylab logo"
            className="absolute -top-10 -left-10 -z-20 w-auto mx-auto "
          />
          <img
            src={skylabLogoWingSmall}
            alt="skylab logo"
            className="absolute -top-10 -right-10 -z-20 w-auto mx-auto rotate-90"
          />
          <img
            src={skylabLogoWingSmall}
            alt="skylab logo"
            className="absolute -bottom-10 -right-10 -z-20 w-auto mx-auto rotate-180"
          />
          <img
            src={skylabLogoWingSmall}
            alt="skylab logo"
            className="absolute -bottom-10 -left-10 -z-20 w-auto mx-auto -rotate-90"
          />
          <img
            src={skylabLogoWingLarge}
            alt="skylab logo"
            className="absolute -left-24 top-1/2 transform -translate-y-1/2 -z-20 w-auto mx-auto"
          />
          <img
            src={skylabLogoWingLarge}
            alt="skylab logo"
            className="absolute -right-24 top-1/2 transform -translate-y-1/2 -z-20 w-auto mx-auto rotate-180"
          />
          {/* </div> */}
          <Login
            onFlip={handleFlip}
            onSubmit={handleLogin}
            // side="front"
            // side={isFlipped ? "back" : "front"}
          />
          {/* </div> */}
          {/* <div className="back"> */}
          <Signup
            onFlip={handleFlip}
            onSubmit={handleSignup}
            // side="back"
            // side={isFlipped ? "front" : "back"}
          />
        </section>
        {/* </div> */}
        {/* </div> */}
        {/* </CardContent> */}
        {/* </Card> */}
      </div>
    </ThemeProvider>
  );
};

export default AuthPage;
