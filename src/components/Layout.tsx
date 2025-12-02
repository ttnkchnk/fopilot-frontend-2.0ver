import { ReactNode, useEffect, useState } from "react";
import { MessageSquare, Calculator, LogOut, User, Menu, TrendingUp, LayoutDashboard, TrendingDown, FileText, CalendarDays, FilePlus, HelpCircle, DollarSign, Users, Archive, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { toast } from "sonner";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  userName?: string;
}

export function Layout({ children, onLogout, userName }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { next } = useNotifications();
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (next && !notified) {
      toast.info(`${next.title}`, {
        description: `Дедлайн ${next.deadline} — через ${next.daysLeft} дн.`,
      });
      setNotified(true);
    }
  }, [next, notified]);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const navItems = [
    { path: "/", label: "Панель", icon: LayoutDashboard },
    { path: "/chat", label: "Чат", icon: MessageSquare },
    { path: "/income", label: "Доходи", icon: TrendingUp },
    { path: "/expenses", label: "Витрати", icon: TrendingDown },
    { path: "/taxes", label: "Податки", icon: Calculator },
    { path: "/documents", label: "Документи", icon: FileText },
    { path: "/archive", label: "Архів", icon: Archive },
    { path: "/forms", label: "Бланки", icon: FilePlus },
    { path: "/calendar", label: "Календар", icon: CalendarDays },
    { path: "/client-crm", label: "Клієнти (опц.)", icon: Users },
    { path: "/currency-dashboard", label: "Валюта", icon: DollarSign },
    { path: "/knowledge-base", label: "База знань", icon: HelpCircle },
    { path: "/profile", label: "Профіль", icon: User },
  ];

  const navButtonClasses = (path: string) => {
    const active = isActive(path);
    return `w-full justify-start gap-3 rounded-xl border transition-all ${
      active
        ? "bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-blue-600/70 text-white border-white/10 shadow-[0_10px_30px_rgba(59,130,246,0.25)]"
        : "text-slate-200 hover:text-white hover:bg-white/5 border-transparent"
    }`;
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]">
          FOPilot
        </h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                {next && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                    1
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="right"
              align="start"
              className="w-80 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-xl animate-in fade-in-0 zoom-in-95"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Нагадування
              </div>
              {next ? (
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-white">{next.title}</div>
                  <div className="text-slate-300 text-xs">Дедлайн {next.deadline}</div>
                  <div className="text-slate-300 text-xs">Через {next.daysLeft} дн.</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-400 text-white hover:bg-amber-400 hover:text-slate-900"
                    onClick={() => handleNavigate("/calendar")}
                  >
                    В календар
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Найближчих дедлайнів немає</p>
              )}
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => handleNavigate("/profile")}
          >
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gray-700 text-white text-sm">
                {userName
                  ? userName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "ГП"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Button
              key={path}
              variant="ghost"
              className={navButtonClasses(path)}
              onClick={() => handleNavigate(path)}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={`w-5 h-5 ${active ? "text-white" : "text-blue-200/80"}`} />
              {label}
            </Button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl border transition-all text-white hover:text-white hover:bg-white/5 border-white/10 shadow-[0_0_14px_rgba(59,130,246,0.35)] hover:shadow-[0_0_18px_rgba(59,130,246,0.45)] drop-shadow-[0_0_16px_rgba(59,130,246,0.6)]"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Вийти з акаунту
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/60 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800/80 text-white border-r border-gray-800 backdrop-blur-xl flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white backdrop-blur-xl border-b border-gray-700 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Навігаційне меню</SheetTitle>
              <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-semibold drop-shadow-[0_0_16px_rgba(59,130,246,0.7)] mx-auto">FOPilot</h1>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative">
                <Bell className="w-5 h-5" />
                {next && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">1</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-xl animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-300 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Нагадування
              </div>
              {next ? (
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-white">{next.title}</div>
                  <div className="text-slate-300 text-xs">Дедлайн {next.deadline}</div>
                  <div className="text-slate-300 text-xs">Через {next.daysLeft} дн.</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-400 text-white hover:bg-amber-400 hover:text-slate-900"
                    onClick={() => {
                      handleNavigate("/calendar");
                    }}
                  >
                    В календар
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Найближчих дедлайнів немає</p>
              )}
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => handleNavigate("/profile")}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-gray-700 text-white text-sm">
                {userName
                  ? userName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "ГП"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col pt-[57px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
