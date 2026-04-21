import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Activity,
  TrendingUp,
  BarChart3,
  Shield,
  AlertTriangle,
  Users,
  HeartHandshake,
  MessagesSquare,
  Share2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/workforce", label: "THW Workforce", icon: Users },
  { to: "/claims", label: "Claims", icon: FileText },
  { to: "/hedis", label: "HEDIS Measures", icon: Activity },
  { to: "/forecast", label: "Forecast", icon: TrendingUp },
  { to: "/roi", label: "ROI Analysis", icon: BarChart3 },
  { to: "/insurance", label: "Insurance Plans", icon: Shield },
  { to: "/denials", label: "Denial Management", icon: AlertTriangle },
  { to: "/join", label: "Join the Co-op", icon: HeartHandshake },
  { to: "/forum", label: "Member Forum", icon: MessagesSquare },
  { to: "/remix", label: "Remix for your state", icon: Share2 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-sidebar flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Oregon THW</p>
              <p className="text-white/60 text-xs leading-tight">Alliance Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? location === "/" : location.startsWith(to);
            return (
              <Link
                key={to}
                href={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-white/40 text-xs">Zero Denial Goal: 2030</p>
          <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-1 bg-white/60 rounded-full" style={{ width: "35%" }} />
          </div>
          <p className="text-white/40 text-xs mt-1">35% of the way there</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-sidebar border-b border-sidebar-border">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/80 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="text-white font-semibold text-sm">Oregon THW Alliance</span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
