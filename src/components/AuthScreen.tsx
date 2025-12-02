// src/components/AuthScreen.tsx
import { type FormEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogleBackend,
  type AuthResponse,
} from "../services/authApi";
import { toast } from "sonner";

type AuthUser = AuthResponse["user"];

interface AuthScreenProps {
  onLogin: (user?: AuthUser) => void;
}

export function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response: AuthResponse;

      if (isLogin) {
        response = await loginWithEmail({ email, password });
        toast.success("Успішний вхід");
      } else {
        response = await registerWithEmail({
          email,
          password,
          first_name: firstName || "User",
          last_name: lastName || "",
          phone: phone || undefined,
        });
        toast.success("Реєстрація успішна");
      }

      onLogin(response.user);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.detail ?? "Помилка авторизації");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const [firstNameGoogle, ...lastNameParts] = (user.displayName || "").split(" ");

      // получаем id_token от Firebase (самый частый вариант)
      const idToken = await user.getIdToken();

      const response = await loginWithGoogleBackend({
        id_token: idToken,
        uid: user.uid,
        email: user.email || "",
        first_name: firstNameGoogle || "User",
        last_name: lastNameParts.join(" ") || "",
      });

      toast.success("Успішний вхід через Google");
      onLogin(response.user);
    } catch (error: any) {
      console.error(error);
      toast.error("Помилка Google входу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950 p-4">
      <Card className="w-full max-w-md border border-[#3be2ff33] bg-[#0f172a]/90 backdrop-blur-xl shadow-[0_0_30px_-12px_rgba(59,226,255,0.6)] text-white">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]">FOPilot</CardTitle>
          <CardDescription className="text-slate-300">
            {isLogin ? "Увійдіть до свого облікового запису" : "Створіть новий обліковий запис"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleEmailSubmit} className="space-y-4">
      {!isLogin && (
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="firstName">Імʼя</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="lastName">Прізвище</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
      )}

      {!isLogin && (
        <div className="space-y-1">
          <Label htmlFor="phone">Телефон (необовʼязково)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+380 XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.45)] border border-white/10"
                disabled={loading}
              >
                {loading ? "Завантаження..." : isLogin ? "Увійти" : "Зареєструватися"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border border-white/20 text-white hover:text-white hover:bg-white/5"
                onClick={() => setIsLogin((prev) => !prev)}
              >
                {isLogin ? "Реєстрація" : "Увійти"}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0f172a] px-2 text-slate-400 text-xs uppercase">
                або
              </span>
            </div>
          </div>

          <Button
            className="w-full h-12 gap-3 bg-white/10 border border-white/20 text-white hover:bg-white/15 shadow-[0_10px_30px_rgba(59,130,246,0.2)]"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span>{loading ? "Завантаження..." : "Увійти через Google"}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
