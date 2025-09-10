import { FaUser } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
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
import { useAuth } from "@/hooks/use-auth";

// ⬇️ Casos de uso hexagonales
import {
  Login as LoginUseCase,
  ForgotPassword as ForgotPasswordUseCase,
  VerifyRecovery as VerifyRecoveryUseCase,
} from "@/application/auth";
import { AuthApi } from "@/infrastructure/services/recibos.api";

// Tipos de props
type LoginHeaderProps = { isForgotPassword: boolean };
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

// Instancias de repo + casos de uso
const authRepo = new AuthApi();
const loginUseCase = new LoginUseCase(authRepo);
const forgotPasswordUseCase = new ForgotPasswordUseCase(authRepo);
const verifyRecoveryUseCase = new VerifyRecoveryUseCase(authRepo);

// Header
const LoginHeader: React.FC<LoginHeaderProps> = ({ isForgotPassword }) => (
  <CardHeader className="flex flex-col items-center">
    {/* coloca tu logo */}
    {/* <img src={logoCalidda} alt="Logo" className="h-11 w-auto object-cover mb-4" /> */}
    <CardDescription className="text-center text-gray-700 text-md font-semibold mb-2">
      Sistema de Reparto de Recibos
    </CardDescription>
    <CardTitle className="text-center mb-6 text-primary-500 text-3xl font-extrabold">
      {isForgotPassword ? "Recuperar Contraseña" : "Iniciar Sesión"}
    </CardTitle>
  </CardHeader>
);

// Form Login
const LoginForm: React.FC<LoginFormProps> = ({ visiblePass, setVisiblePass, handleChange }) => (
  <>
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="username">Ingrese su usuario:</Label>
      <Input
        type="text"
        id="username"
        name="username"
        onChange={handleChange}
        icon={
          <FaUser className="cursor-pointer text-md hover:text-primary-500 transition-colors" />
        }
      />
    </div>
    <div className="grid w-full items-center gap-2">
      <Label htmlFor="password">Ingrese su contraseña:</Label>
      <Input
        type={visiblePass ? "text" : "password"}
        id="password"
        name="password"
        onChange={handleChange}
        icon={
          visiblePass ? (
            <IoIosEyeOff
              className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
              onClick={() => setVisiblePass((prev) => !prev)}
            />
          ) : (
            <IoIosEye
              className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
              onClick={() => setVisiblePass((prev) => !prev)}
            />
          )
        }
      />
    </div>
  </>
);

// Form Forgot Password
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  isOtpSent,
  email,
  otp,
  secondsRemaining,
  handleEmailChange,
  handleOtpChange,
  handleResend,
}) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };
  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="email">Ingrese su correo o usuario:</Label>
        <Input type="text" id="email" name="email" value={email} onChange={handleEmailChange} />
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

// Footer
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
          type="button"
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
          type="button"
          onClick={() => setIsForgotPassword(false)}
        >
          Ya tengo una cuenta
        </Button>
      </>
    )}
  </CardFooter>
);

// Página
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [visiblePass, setVisiblePass] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [loginForm, setLoginForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(300);

  // Timer para OTP
  useEffect(() => {
    if (isOtpSent && secondsRemaining > 0) {
      const t = setInterval(() => setSecondsRemaining((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [isOtpSent, secondsRemaining]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleOtpChange = (value: string) => setOtp(value);

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Ingresa tu usuario/correo para reenviar el OTP.");
      return;
    }
    const promise = forgotPasswordUseCase.exec({ login: email.trim() });
    await toast.promise(promise, {
      loading: "Reenviando código...",
      success: "Se envió un nuevo código a tu correo.",
      error: "No se pudo reenviar el código.",
    });
    setSecondsRemaining(300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isForgotPassword) {
      if (!isOtpSent) {
        // Enviar código
        if (!email.trim()) {
          toast.error("Ingresa tu usuario/correo.");
          return;
        }
        const promise = forgotPasswordUseCase.exec({ login: email.trim() });
        await toast.promise(promise, {
          loading: "Enviando código...",
          success: () => {
            setIsOtpSent(true);
            setSecondsRemaining(300);
            return "Código enviado. Revisa tu correo.";
          },
          error: "No se pudo enviar el código.",
        });
      } else {
        // Validar código
        if (!otp.trim()) {
          toast.error("Ingresa el código OTP.");
          return;
        }
        const promise = verifyRecoveryUseCase.exec({ login: email.trim(), code: otp.trim() });
        await toast.promise(promise, {
          loading: "Validando código...",
          success: "Código validado correctamente.",
          error: "Código inválido o expirado.",
        });
        // Aquí podrías navegar a una pantalla de “restablecer contraseña”
        // navigate("/reset-password");
      }
      return;
    }

    // Login normal
    const payload = { login: loginForm.username.trim(), passwordPlano: loginForm.password };
    toast.promise(loginUseCase.exec(payload), {
      loading: "Iniciando sesión...",
      success: (res: any) => {
        loginUser(res);

        if (res.code === "PASSWORD_CHANGE_REQUIRED") {
          navigate("/cambiar-contrasena");
          return `¡Bienvenido por favor cambie su contrasena!`;
        } else {
          navigate("/dashboard");
          return `¡Bienvenido ${res?.usuario?.nombre ?? ""}!`;
        }
      },
      error: "Credenciales inválidas o error en el servidor",
      position: "top-right",
    });
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
