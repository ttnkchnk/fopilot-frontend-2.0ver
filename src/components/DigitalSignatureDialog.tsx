import { useState } from "react";
import { Shield, Key, Upload, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DigitalSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSign: () => void;
}

export function DigitalSignatureDialog({
  open,
  onOpenChange,
  onSign,
}: DigitalSignatureDialogProps) {
  const [authority, setAuthority] = useState("");
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setKeyFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKeyFile(e.target.files[0]);
    }
  };

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSigned(true);
      setTimeout(() => {
        onSign();
        onOpenChange(false);
        // Reset state
        setSigned(false);
        setKeyFile(null);
        setPassword("");
        setAuthority("");
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    if (!isSigning) {
      onOpenChange(false);
      setSigned(false);
      setKeyFile(null);
      setPassword("");
      setAuthority("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-50 dark:bg-card">
        {!signed ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle className="text-xl">Підписати документ</DialogTitle>
              </div>
              <DialogDescription>
                Використовуйте ваш кваліфікований електронний підпис (КЕП) для підписання документа
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Certificate Authority */}
              <div className="space-y-2">
                <Label htmlFor="authority">Центр сертифікації</Label>
                <Select value={authority} onValueChange={setAuthority}>
                  <SelectTrigger id="authority">
                    <SelectValue placeholder="Оберіть ЦСК" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privatbank">ПриватБанк</SelectItem>
                    <SelectItem value="taxoffice">Державна податкова служба</SelectItem>
                    <SelectItem value="iit">ІІТ (Інститут інформаційних технологій)</SelectItem>
                    <SelectItem value="masterkey">MasterKey</SelectItem>
                    <SelectItem value="алтіон">Алтіон</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="keyfile">Файл ключа (.dat, .jks, .pfx)</Label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                      : keyFile
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    id="keyfile"
                    type="file"
                    accept=".dat,.jks,.pfx,.pk8"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    {keyFile ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <p className="text-sm text-center">
                          <span className="text-green-600 font-medium">{keyFile.name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(keyFile.size / 1024).toFixed(2)} KB
                        </p>
                      </>
                    ) : (
                      <>
                        <Key className="w-8 h-8 text-slate-400" />
                        <p className="text-sm text-center">
                          <span className="text-blue-600">Перетягніть файл</span> або натисніть для вибору
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Підтримуються .dat, .jks, .pfx
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Пароль ключа</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введіть пароль"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Ваші дані захищені. Приватний ключ та пароль не зберігаються на сервері.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSigning}
              >
                Скасувати
              </Button>
              <Button
                type="button"
                onClick={handleSign}
                disabled={!authority || !keyFile || !password || isSigning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSigning ? "Підписую..." : "Підписати"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle className="text-2xl text-center">
                  Документ успішно підписано
                </DialogTitle>
                <DialogDescription className="text-center">
                  Ваш документ був підписаний кваліфікованим електронним підписом
                </DialogDescription>
              </div>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
