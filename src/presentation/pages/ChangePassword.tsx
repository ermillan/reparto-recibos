import { useEffect, useMemo, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

// Caso de uso/capa de infraestructura
import { ChangePasswordFirstTime } from "@/application/auth";
import { AuthApi } from "@/infrastructure/services/recibos.api";

const authRepo = new AuthApi();
const changePasswordFirstTime = new ChangePasswordFirstTime(authRepo);

type PasswordState = { newPassword: string; confirmPassword: string };
const MIN_LEN = 8;

// Normaliza la obtención del reset token
const pickResetToken = (loc: ReturnType<typeof useLocation>): string => {
  const fromState = (loc.state as any)?.resetToken as string | undefined;
  const fromSession = sessionStorage.getItem("resetToken") ?? "";
  const candidate = (fromState ?? fromSession)?.trim();
  if (!candidate || candidate === "undefined" || candidate === "null") return "";
  return candidate;
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [resetToken, setResetToken] = useState<string>(() => pickResetToken(location));
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<{ newPass: boolean; confirm: boolean }>({
    newPass: false,
    confirm: false,
  });
  const [form, setForm] = useState<PasswordState>({ newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const token = pickResetToken(location);
    if (!token) {
      toast.error("Token de recuperación no encontrado o expirado.");
      navigate("/login", { replace: true });
      return;
    }
    setResetToken(token);
    sessionStorage.setItem("resetToken", token); // respaldo por si recargan
  }, [location, navigate]);

  const rules = useMemo(() => {
    const hasMinLen = form.newPassword.length >= MIN_LEN;
    const hasUpper = /[A-Z]/.test(form.newPassword);
    const hasLower = /[a-z]/.test(form.newPassword);
    const hasNumber = /[0-9]/.test(form.newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(form.newPassword);
    const matches = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;
    return { hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial, matches };
  }, [form]);

  const isValid = useMemo(
    () =>
      rules.hasMinLen &&
      rules.hasUpper &&
      rules.hasLower &&
      rules.hasNumber &&
      rules.hasSpecial &&
      rules.matches,
    [rules]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisible = (key: "newPass" | "confirm") =>
    setVisible((v) => ({ ...v, [key]: !v[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !resetToken) return;
    if (loading) return; // evita doble click

    try {
      setLoading(true);

      // 1) promesa real del API
      const p = changePasswordFirstTime.exec({
        resetToken,
        newPassword: form.newPassword,
      });

      // 2) un solo toast (éxito/loader/error)
      toast.promise(p, {
        loading: "Actualizando...",
        success: "Contraseña actualizada correctamente. Inicia sesión con tu nueva clave.",
        error: "No se pudo actualizar.",
      });

      // 3) espera el resultado real
      await p;

      // 4) post-acción sin otro toast.success
      sessionStorage.removeItem("resetToken");
      navigate("/login", { replace: true });
    } catch (err) {
      // El toast de error ya lo mostró toast.promise
      console.error("changePassword error:", err);
    } finally {
      setLoading(false);
    }
  };

  const RuleItem = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className={`text-sm ${ok ? "text-emerald-600" : "text-gray-500"}`}>
      {ok ? "✓" : "•"} {label}
    </li>
  );

  return (
    <main className="bg-background relative overflow-hidden antialiased">
      <div className="absolute inset-0 bg-primary-500 [clip-path:polygon(0_0,100%_0,100%_-40%,0_150%)] z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-[100svh] px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardDescription className="text-gray-700 text-md font-semibold mb-1">
              Sistema de Reparto de Recibos
            </CardDescription>
            <CardTitle className="text-primary-500 text-3xl font-extrabold">
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={visible.newPass ? "text" : "password"}
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  icon={
                    visible.newPass ? (
                      <IoIosEyeOff
                        className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
                        onClick={() => toggleVisible("newPass")}
                      />
                    ) : (
                      <IoIosEye
                        className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
                        onClick={() => toggleVisible("newPass")}
                      />
                    )
                  }
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={visible.confirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  icon={
                    visible.confirm ? (
                      <IoIosEyeOff
                        className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
                        onClick={() => toggleVisible("confirm")}
                      />
                    ) : (
                      <IoIosEye
                        className="cursor-pointer text-xl hover:text-primary-500 transition-colors"
                        onClick={() => toggleVisible("confirm")}
                      />
                    )
                  }
                />
                {form.confirmPassword.length > 0 && !rules.matches && (
                  <p className="text-xs text-red-600">Las contraseñas no coinciden.</p>
                )}
              </div>

              <div className="rounded-md bg-muted/60 p-3">
                <p className="text-xs mb-2 text-muted-foreground">La contraseña debe contener:</p>
                <ul className="grid grid-cols-1 gap-1">
                  <RuleItem ok={rules.hasMinLen} label={`Mínimo ${MIN_LEN} caracteres`} />
                  <RuleItem ok={rules.hasUpper} label="Una letra mayúscula (A-Z)" />
                  <RuleItem ok={rules.hasLower} label="Una letra minúscula (a-z)" />
                  <RuleItem ok={rules.hasNumber} label="Un número (0-9)" />
                  <RuleItem ok={rules.hasSpecial} label="Un carácter especial (!@#$%^&*...)" />
                  <RuleItem ok={rules.matches} label="Coincidir con la confirmación" />
                </ul>
              </div>

              <div className="h-2 w-full bg-muted rounded overflow-hidden">
                {(() => {
                  const score = [
                    rules.hasMinLen,
                    rules.hasUpper,
                    rules.hasLower,
                    rules.hasNumber,
                    rules.hasSpecial,
                  ].filter(Boolean).length;
                  const width = `${(score / 5) * 100}%`;
                  return <div className="h-full bg-primary transition-all" style={{ width }} />;
                })()}
              </div>

              <CardFooter className="px-0">
                <Button
                  type="submit"
                  className="w-full font-medium"
                  disabled={!isValid || loading || !resetToken}
                >
                  {loading ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
