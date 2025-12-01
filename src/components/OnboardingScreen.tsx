import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft, Check, User, Calculator, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { completeOnboarding, type OnboardingPayload, type User as AppUser } from "../services/userService";
import { toast } from "sonner";

interface OnboardingData {
  firstName: string;
  lastName: string;
  middleName: string;
  taxId: string;
  email: string;
  phone: string;
  taxGroup: "2" | "3" | "";
  paysESV: boolean;
  selectedKveds: string[];
}

interface OnboardingScreenProps {
  onComplete?: (user: AppUser) => void;
  defaultFullName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}

export function OnboardingScreen({ onComplete, defaultFullName, defaultEmail, defaultPhone }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [submitting, setSubmitting] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    firstName: defaultFullName ? defaultFullName.split(" ")[0] : "",
    lastName: defaultFullName ? defaultFullName.split(" ").slice(1).join(" ") : "",
    middleName: "",
    taxId: "",
    email: defaultEmail || "",
    phone: defaultPhone || "",
    taxGroup: "",
    paysESV: true,
    selectedKveds: []
  });

  useEffect(() => {
    const parts = (defaultFullName || "").split(" ");
    const firstName = parts[0] || "";
    const rest = parts.slice(1).join(" ");
    setData((prev) => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: rest || prev.lastName,
      email: defaultEmail || prev.email,
      phone: defaultPhone || prev.phone,
    }));
  }, [defaultFullName, defaultEmail, defaultPhone]);

  const progress = (currentStep / totalSteps) * 100;

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const updatedUser = await completeOnboarding({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
        taxGroup: data.taxGroup,
        paysESV: data.paysESV,
        selectedKveds: data.selectedKveds,
      } as OnboardingPayload);
      toast.success("Онбординг збережено");
      onComplete?.(updatedUser);
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося зберегти онбординг");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.firstName && data.lastName && data.taxId && data.email;
      case 2:
        return data.taxGroup !== "";
      case 3:
        return data.selectedKveds.length > 0;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: "Особисті дані", icon: User },
    { number: 2, title: "Налаштування податків", icon: Calculator },
    { number: 3, title: "Види діяльності", icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="space-y-4">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCompleted
                            ? "bg-blue-600 border-blue-600 text-white"
                            : isCurrent
                            ? "border-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-xs mt-1 text-center hidden sm:block text-muted-foreground">
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 transition-all ${
                          isCompleted ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <Progress value={progress} className="h-2" />

            <div className="pt-2">
              <CardTitle>
                {currentStep === 1 && "Давайте познайомимось"}
                {currentStep === 2 && "Налаштуйте податки"}
                {currentStep === 3 && "Оберіть види діяльності"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Заповніть ваші основні дані"}
                {currentStep === 2 && "Виберіть групу єдиного податку та налаштування ЄСВ"}
                {currentStep === 3 && "Вкажіть коди КВЕД вашої діяльності"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="firstName">Імʼя</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => setData({ ...data, firstName: e.target.value })}
                      placeholder="Іван"
                    />
                  </div>
                  <div>
                    <Label htmlFor="middleName">По батькові (необовʼязково)</Label>
                    <Input
                      id="middleName"
                      value={data.middleName}
                      onChange={(e) => setData({ ...data, middleName: e.target.value })}
                      placeholder="Іванович"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Прізвище</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => setData({ ...data, lastName: e.target.value })}
                      placeholder="Іваненко"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="taxId">Реєстраційний номер облікової картки (ІПН)</Label>
                  <Input
                    id="taxId"
                    value={data.taxId}
                    onChange={(e) => setData({ ...data, taxId: e.target.value })}
                    placeholder="1234567890"
                    maxLength={10}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Електронна пошта</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон (необов'язково)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tax Settings */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Оберіть групу єдиного податку</Label>
                <div className="grid gap-3">
                  <button
                    onClick={() => setData({ ...data, taxGroup: "2" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      data.taxGroup === "2"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p>Група 2</p>
                          {data.taxGroup === "2" && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          До 1 559 700 грн на рік. Без ПДВ. Надання послуг платникам єдиного податку та населенню.
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setData({ ...data, taxGroup: "3" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      data.taxGroup === "3"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p>Група 3 (5%)</p>
                          {data.taxGroup === "3" && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          До 7 000 000 грн на рік. Можливість реєстрації платником ПДВ. Будь-яка діяльність.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="esv-toggle">Я сплачую ЄСВ</Label>
                  <p className="text-sm text-muted-foreground">
                    Єдиний соціальний внесок (обов'язковий для пенсійного страхування)
                  </p>
                </div>
                <Switch
                  id="esv-toggle"
                  checked={data.paysESV}
                  onCheckedChange={(checked) => setData({ ...data, paysESV: checked })}
                />
              </div>
            </div>
          )}

          {/* Step 3: KVED Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="business-desc">Опишіть вашу діяльність своїми словами</Label>
                <div className="relative">
                  <Input
                    id="business-desc"
                    placeholder="Наприклад: розробка веб-сайтів та мобільних додатків"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI підкаже найбільш підходящі коди КВЕД
                </p>
              </div>

              <div>
                <Label>Рекомендовані коди діяльності</Label>
                <div className="space-y-2 mt-2">
                  {[
                    { code: "62.01", name: "Комп'ютерне програмування" },
                    { code: "62.02", name: "Консультування з питань інформатизації" },
                    { code: "63.11", name: "Оброблення даних, розміщення інформації" },
                    { code: "73.11", name: "Діяльність рекламних агентств" }
                  ].map((kved) => {
                    const isSelected = data.selectedKveds.includes(kved.code);
                    return (
                      <button
                        key={kved.code}
                        onClick={() => {
                          if (isSelected) {
                            setData({
                              ...data,
                              selectedKveds: data.selectedKveds.filter((k) => k !== kved.code)
                            });
                          } else {
                            setData({
                              ...data,
                              selectedKveds: [...data.selectedKveds, kved.code]
                            });
                          }
                        }}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm">
                              {kved.code} — {kved.name}
                            </p>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {data.selectedKveds.length > 0 && (
                <div>
                  <Label>Вибрані коди</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.selectedKveds.map((code) => (
                      <div
                        key={code}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm flex items-center gap-2"
                      >
                        {code}
                        <button
                          onClick={() =>
                            setData({
                              ...data,
                              selectedKveds: data.selectedKveds.filter((k) => k !== code)
                            })
                          }
                          className="hover:text-blue-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button onClick={nextStep} disabled={!canProceed() || submitting}>
              {currentStep === totalSteps ? (submitting ? "Збереження..." : "Завершити") : "Продовжити"}
              {currentStep < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
