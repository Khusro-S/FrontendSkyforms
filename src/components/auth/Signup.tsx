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
  // Link,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

interface SignupProps {
  onSubmit: (data: SignupData) => void;
  signupLoading: boolean;
  // onFlip: () => void;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup = ({ onSubmit, signupLoading }: SignupProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    const savedData = localStorage.getItem("signupData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.email) setEmail(parsedData.email);
        if (parsedData.password) setPassword(parsedData.password);
        if (parsedData.showPassword) setShowPassword(parsedData.showPassword);
        if (parsedData.confirmPassword)
          setConfirmPassword(parsedData.confirmPassword);
        if (parsedData.showConfirmPassword)
          setShowConfirmPassword(parsedData.showConfirmPassword);
      } catch (error) {
        console.error("Failed to parse signupData:", error);
        // remove corrupted data
        localStorage.removeItem("signupData");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "signupData",
      JSON.stringify({
        email,
        password,
        showPassword,
        confirmPassword,
        showConfirmPassword,
      })
    );
  }, [email, password, showPassword, confirmPassword, showConfirmPassword]);

  const validate = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password, confirmPassword });

      localStorage.removeItem("signupData");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="back flex flex-col items-center justify-center gap-5 px-5">
      {/* <img
        src={skylabLogoPurple}
        alt="skylab logo"
        className="absolute inset-x-0 -top-[13%] -z-20 w-auto max-w-[80%] mx-auto"
      /> */}
      <Typography variant="h1" component="h2">
        Welcome to Sky Forms
      </Typography>
      <Typography variant="h4" component="h4">
        Sign Up
      </Typography>
      <FormControl
        fullWidth
        error={Boolean(errors.email)}
        // className="mb-4"
        variant="standard"
      >
        <InputLabel htmlFor="signupEmail">Email Address</InputLabel>
        <Input
          id="signupEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          //   className="mt-2"
        />
        {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(errors.password)}
        // className="mb-4"
        variant="standard"
      >
        <InputLabel htmlFor="signupPassword">Password</InputLabel>
        <Input
          id="signupPassword"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(errors.confirmPassword)}
        // className="mb-4"
        variant="standard"
      >
        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          //   className="mt-2"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle confirm password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showConfirmPassword ? (
                  <VisibilityOff color="primary" />
                ) : (
                  <Visibility color="primary" />
                )}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.confirmPassword && (
          <FormHelperText>{errors.confirmPassword}</FormHelperText>
        )}
      </FormControl>

      {/* <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Sign Up
      </Button> */}
      <Button
        variant="contained"
        color="primary"
        disabled={signupLoading}
        // fullWidth
        onClick={handleSubmit}
        sx={{ fontSize: "1.5rem", padding: "0 15px", borderRadius: "0.75rem" }}
      >
        {signupLoading ? "Creating account..." : "Sign Up"}
      </Button>
      {/* 
      <Typography color="secondary.main">
        Already have an account?{" "}
        <Link onClick={onFlip} color="primary" className="hover:cursor-pointer">
          Log In
        </Link>
      </Typography> */}
    </div>
  );
};

export default Signup;
