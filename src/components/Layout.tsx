import { ReactNode, useState } from "react";
import { MessageSquare, Calculator, LogOut, User, Menu, TrendingUp, LayoutDashboard, TrendingDown, FileText, CalendarDays, FilePlus, HelpCircle, DollarSign, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
  userName?: string;
}

export function Layout({ children, onLogout, userName }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-blue-500">FOPilot</h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => handleNavigate("/profile")}
        >
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white text-sm">
              {userName
                ? userName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "ІП"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/")}
        >
          <LayoutDashboard className="w-5 h-5" />
          Панель
        </Button>

        <Button
          variant={isActive("/chat") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/chat") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/chat")}
        >
          <MessageSquare className="w-5 h-5" />
          Чат
        </Button>

        <Button
          variant={isActive("/income") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/income") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/income")}
        >
          <TrendingUp className="w-5 h-5" />
          Доходи
        </Button>

        <Button
          variant={isActive("/expenses") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/expenses") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/expenses")}
        >
          <TrendingDown className="w-5 h-5" />
          Витрати
        </Button>

        <Button
          variant={isActive("/taxes") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/taxes") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/taxes")}
        >
          <Calculator className="w-5 h-5" />
          Податки
        </Button>

        <Button
          variant={isActive("/documents") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/documents") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/documents")}
        >
          <FileText className="w-5 h-5" />
          Документи
        </Button>

        <Button
          variant={isActive("/forms") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/forms") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/forms")}
        >
          <FilePlus className="w-5 h-5" />
          Бланки
        </Button>

        <Button
          variant={isActive("/calendar") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/calendar") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/calendar")}
        >
          <CalendarDays className="w-5 h-5" />
          Календар
        </Button>

        <Button
          variant={isActive("/client-crm") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/client-crm") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/client-crm")}
        >
          <Users className="w-5 h-5" />
          Клієнти (опц.)
        </Button>

        <Button
          variant={isActive("/currency-dashboard") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/currency-dashboard") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/currency-dashboard")}
        >
          <DollarSign className="w-5 h-5" />
          Валюта
        </Button>

        <Button
          variant={isActive("/knowledge-base") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/knowledge-base") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/knowledge-base")}
        >
          <HelpCircle className="w-5 h-5" />
          База знань
        </Button>

        <Button
          variant={isActive("/profile") ? "default" : "ghost"}
          className={`w-full justify-start gap-3 ${
            isActive("/profile") ? "" : "text-sidebar-foreground hover:bg-sidebar-accent"
          }`}
          onClick={() => handleNavigate("/profile")}
        >
          <User className="w-5 h-5" />
          Профіль
        </Button>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Вийти
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/60 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/10">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white/70 dark:bg-sidebar/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-sidebar-border flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-card/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <h1 className="text-blue-500">FOPilot</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => handleNavigate("/profile")}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                ІП
              </AvatarFallback>
            </Avatar>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Навігаційне меню</SheetTitle>
              <div className="flex flex-col h-full bg-sidebar">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col pt-[57px] md:pt-0">
        {children}
      </main>
    </div>
  );
}
