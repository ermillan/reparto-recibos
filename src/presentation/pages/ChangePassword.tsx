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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

// ⬇️ (Opcional) Caso de uso si lo tienes en tu capa Application
import { ChangePasswordFirstTime } from "@/application/auth";
import { AuthApi } from "@/infrastructure/services/recibos.api";

const authRepo = new AuthApi();
const changePasswordFirstTime = new ChangePasswordFirstTime(authRepo);

type PasswordState = {
  newPassword: string;
  confirmPassword: string;
};

const MIN_LEN = 8;

export default function ChangePassword() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState<{ newPass: boolean; confirm: boolean }>({
    newPass: false,
    confirm: false,
  });
  const [form, setForm] = useState<PasswordState>({ newPassword: "", confirmPassword: "" });

  const rules = useMemo(() => {
    const hasMinLen = form.newPassword.length >= MIN_LEN;
    const hasUpper = /[A-Z]/.test(form.newPassword);
    const hasLower = /[a-z]/.test(form.newPassword);
    const hasNumber = /[0-9]/.test(form.newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(form.newPassword);
    const matches = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;

    return { hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial, matches };
  }, [form]);

  const isValid = useMemo(() => {
    return (
      rules.hasMinLen &&
      rules.hasUpper &&
      rules.hasLower &&
      rules.hasNumber &&
      rules.hasSpecial &&
      rules.matches
    );
  }, [rules]);

  // Si quieres impedir espacios al inicio/fin
  useEffect(() => {
    if (/\s/.test(form.newPassword)) {
      // solo aviso; no bloqueo
    }
  }, [form.newPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisible = (key: "newPass" | "confirm") => {
    setVisible((v) => ({ ...v, [key]: !v[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      // ⬇️ Sustituye por tu caso de uso real
      await toast.promise(
        changePasswordFirstTime.exec({ resetToken: token, newPassword: form.newPassword }),
        {
          loading: "Actualizando...",
          success: "Contraseña actualizada.",
          error: "No se pudo actualizar.",
        }
      );
      await new Promise((r) => setTimeout(r, 900)); // simula llamada
      toast.success("Contraseña actualizada correctamente.");
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      toast.error("No se pudo actualizar la contraseña.");
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

              {/* Reglas */}
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

              {/* Barra simple de fortaleza (opcional) */}
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
                <Button type="submit" className="w-full font-medium" disabled={!isValid || loading}>
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
