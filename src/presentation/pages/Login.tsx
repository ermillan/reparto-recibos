import { FaUser } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { login } from "@/infrastructure/auth/auth.api";

import logoCalidda from "@/assets/logo_calidda.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Interfaces for props to improve type safety and readability
type LoginHeaderProps = {
  isForgotPassword: boolean;
};

type LoginFormProps = {
  visiblePass: boolean;
  setVisiblePass: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type ForgotPasswordFormProps = {
  isOtpSent: boolean;
  email: string;
  otp: string;
  secondsRemaining: number;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOtpChange: (value: string) => void;
  handleResend: () => void;
};

type LoginFooterProps = {
  isForgotPassword: boolean;
  isOtpSent: boolean;
  setIsForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

// Shared Header component
const LoginHeader: React.FC<LoginHeaderProps> = ({ isForgotPassword }) => (
  <CardHeader className="flex flex-col items-center">
    <img src={logoCalidda} alt="Logo de Calidda" className="h-11 w-auto object-cover mb-4" />
    <CardDescription className="text-center text-gray-700 text-md font-semibold mb-2">
      Sistema de Reparto de Recibos
    </CardDescription>
    <CardTitle className="text-center mb-6 text-primary-500 text-3xl font-extrabold">
      {isForgotPassword ? "Recuperar Contraseña" : "Iniciar Sesión"}
    </CardTitle>
  </CardHeader>
);

// Login form component
const LoginForm: React.FC<LoginFormProps> = ({ visiblePass, setVisiblePass, handleChange }) => (
  <>
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="username">Ingrese su usuario:</Label>
      <Input
        type="text"
        id="username"
        name="username"
        placeholder=""
        onChange={handleChange}
        icon={
          <FaUser className="cursor-pointer text-md hover:text-primary-500 transition-colors ease-in-out duration-300" />
        }
      />
    </div>
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="password">Ingrese su contraseña:</Label>
      <Input
        type={visiblePass ? "text" : "password"}
        id="password"
        name="password"
        placeholder=""
        onChange={handleChange}
        icon={
          visiblePass ? (
            <IoIosEyeOff
              className="cursor-pointer text-xl hover:text-primary-500 transition-colors ease-in-out duration-300"
              onClick={() => setVisiblePass((prev) => !prev)}
            />
          ) : (
            <IoIosEye
              className="cursor-pointer text-xl hover:text-primary-500 transition-colors ease-in-out duration-300"
              onClick={() => setVisiblePass((prev) => !prev)}
            />
          )
        }
      />
    </div>
  </>
);

// Forgot password form component with countdown timer display
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isOtpSent,
  email,
  otp,
  secondsRemaining,
  handleEmailChange,
  handleOtpChange,
  handleResend,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="email">Ingrese su correo electrónico:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder=""
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      {isOtpSent && (
        <div className="grid w-full items-center gap-2">
          <Label>Ingrese el código OTP:</Label>
          <div className="flex justify-center">
            <InputOTP maxLength={7} value={otp} onChange={handleOtpChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="text-center text-sm text-gray-500 mt-2">
            Tiempo restante: {formatTime(secondsRemaining)}
          </div>
          {secondsRemaining === 0 && (
            <Button className="w-full mt-2" variant="outline" onClick={handleResend}>
              Reenviar OTP
            </Button>
          )}
        </div>
      )}
    </>
  );
};

// Footer component with dynamic buttons (now with explicit types to control submission)
const LoginFooter: React.FC<LoginFooterProps> = ({
  isForgotPassword,
  isOtpSent,
  setIsForgotPassword,
}) => (
  <CardFooter className="flex flex-col gap-2 w-full">
    {!isForgotPassword ? (
      <>
        <Button className="w-full font-medium" variant="default" type="submit">
          Ingresar
        </Button>
        <Button
          className="w-full font-medium"
          variant="link"
          type="button" // Prevent form submission
          onClick={() => setIsForgotPassword(true)}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </>
    ) : (
      <>
        <Button className="w-full font-medium" variant="default" type="submit">
          {isOtpSent ? "Validar" : "Enviar"}
        </Button>
        <Button
          className="w-auto font-medium"
          variant="link"
          type="button" // Prevent form submission
          onClick={() => setIsForgotPassword(false)}
        >
          Ya tengo una cuenta
        </Button>
      </>
    )}
  </CardFooter>
);

// Main Login page component (container: manages state and logic)
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [visiblePass, setVisiblePass] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loginForm, setLoginForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes = 300 seconds

  // Countdown timer effect
  useEffect(() => {
    if (isOtpSent && secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOtpSent, secondsRemaining]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleResend = () => {
    // TODO: Implement resend OTP logic
    // console.log("Resending OTP to:", email)
    setSecondsRemaining(300); // Reset timer
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgotPassword) {
      if (isOtpSent) {
        // TODO: Implement OTP validation logic
        // console.log("Validating OTP:", otp)
      } else {
        // TODO: Implement email sending logic
        // console.log("Sending email to:", email)
        setIsOtpSent(true);
        setSecondsRemaining(300); // Start timer
      }
    } else {
      toast.promise(
        login(loginForm.username, loginForm.password), // tu promesa
        {
          loading: "Iniciando sesión...",
          success: () => {
            // Redirigir al dashboard después de un delay
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
            return "¡Login exitoso!";
          },
          error: "Credenciales inválidas o error en el servidor",
          position: "top-right",
        }
      );
    }
  };

  return (
    <main className="bg-background relative overflow-hidden antialiased">
      <div className="absolute inset-0 bg-primary-500 [clip-path:polygon(0_0,100%_0,100%_-40%,0_150%)] z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-[100svh] px-4">
        <Card className="w-full max-w-sm">
          <LoginHeader isForgotPassword={isForgotPassword} />
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isForgotPassword ? (
                <LoginForm
                  visiblePass={visiblePass}
                  setVisiblePass={setVisiblePass}
                  handleChange={handleChange}
                />
              ) : (
                <ForgotPasswordForm
                  isOtpSent={isOtpSent}
                  email={email}
                  otp={otp}
                  secondsRemaining={secondsRemaining}
                  handleEmailChange={handleEmailChange}
                  handleOtpChange={handleOtpChange}
                  handleResend={handleResend}
                />
              )}
              <LoginFooter
                isForgotPassword={isForgotPassword}
                isOtpSent={isOtpSent}
                setIsForgotPassword={setIsForgotPassword}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Login;
