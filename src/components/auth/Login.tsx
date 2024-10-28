import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Input,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
  FormHelperText,
  Link,
  //   FormControlLabel,
  //   Checkbox,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

// import skylabLogoPurple from "/skylabLogoPurple.svg";

interface LoginProps {
  onSubmit: (data: LoginData) => void;
  onFlip: () => void;
}

interface LoginData {
  email: string;
  password: string;
  //   remember: boolean;
}

const Login = ({ onFlip, onSubmit }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  //   const [remember, setRemember] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem("loginData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.email) setEmail(parsedData.email);
        if (parsedData.password) setPassword(parsedData.password);
        if (parsedData.showPassword) setShowPassword(parsedData.showPassword);
        // if (parsedData.remember !== undefined) setRemember(parsedData.remember);
      } catch (error) {
        console.error("Failed to parse loginData:", error);
        //  remove corrupted data
        localStorage.removeItem("loginData");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "loginData",
      JSON.stringify({ email, password, showPassword })
    );
  }, [email, password, showPassword]);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
      localStorage.removeItem("loginData");

      setEmail("");
      setPassword("");
      //   setRemember(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="front bg-black rounded-xl flex flex-col items-center justify-center gap-y-3 px-5">
      {/* <img
        src={skylabLogoPurple}
        alt="skylab logo"
        className="absolute inset-x-0 -top-[16.5%] -z-20 w-auto max-w-[80%] mx-auto"
      /> */}
      <div className="flex flex-col justify-center items-center gap-0">
        <Typography variant="h1" component="h1" className="text-center">
          Welcome to Sky Forms
        </Typography>
        <Typography
          variant="h4"
          component="h4"
          className="border-b border-solid border-purple"
        >
          Login
        </Typography>
      </div>
      <FormControl
        fullWidth
        error={Boolean(errors.email)}
        // className="mb-4"
        variant="standard"
      >
        <InputLabel htmlFor="loginEmail" sx={{ fontSize: "1.5rem" }}>
          Email Address
        </InputLabel>
        <Input
          id="loginEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //   sx={{
          //     fontSize: "1.5rem",
          //   }}

          //   className="mt-2"
        />
        {errors.email && (
          <FormHelperText sx={{ fontSize: "1rem" }}>
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(errors.password)}
        // className="mb-4"
        variant="standard"
      >
        <InputLabel htmlFor="loginPassword" sx={{ fontSize: "1.5rem" }}>
          Password
        </InputLabel>
        <Input
          id="loginPassword"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          //   sx={{ fontSize: "1.5rem" }}
          //   className="mt-2"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff color="primary" />
                ) : (
                  <Visibility color="primary" />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.password && (
          <FormHelperText sx={{ fontSize: "1rem" }}>
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <Link
        color="secondary.main"
        className="place-self-start hover:cursor-pointer hover:text-purple transition ease-linear duration-150"
        href="/forgot-password"
        sx={{
          "@media (max-width:640px)": {
            fontSize: "0.7rem",
            // lineHeight: "1.5rem",
          },
          "@media (min-width:640px)": {
            fontSize: "0.9rem",
            // lineHeight: "1.75rem",
          },
          "@media (min-width:768px)": {
            fontSize: "1.1rem",
            // lineHeight: "1.75rem",
          },
        }}
      >
        Forgot password ?
      </Link>
      {/* 
      <FormControlLabel
        control={
          <Checkbox
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            color="primary"
            size="small"
          />
        }
        label="Remember me"
        // className="mb-4"
      /> */}

      <Button
        variant="contained"
        color="primary"
        // fullWidth
        onClick={handleSubmit}
      >
        Login
      </Button>
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
        <Link onClick={onFlip} color="primary" className="hover:cursor-pointer">
          Log In
        </Link>
      </Typography>
    </div>
  );
};

export default Login;
