import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Workforce from "@/pages/Workforce";
import Claims from "@/pages/Claims";
import HEDISPage from "@/pages/HEDIS";
import Forecast from "@/pages/Forecast";
import ROI from "@/pages/ROI";
import Insurance from "@/pages/Insurance";
import Denials from "@/pages/Denials";
import Join from "@/pages/Join";
import Forum from "@/pages/Forum";
import Remix from "@/pages/Remix";
// Admin is intentionally unlinked from the sidebar — only people who know the
// /admin URL find it. Access is gated to active team members (see Admin.tsx
// and the api-server team_members table).
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/workforce" component={Workforce} />
        <Route path="/claims" component={Claims} />
        <Route path="/hedis" component={HEDISPage} />
        <Route path="/forecast" component={Forecast} />
        <Route path="/roi" component={ROI} />
        <Route path="/insurance" component={Insurance} />
        <Route path="/denials" component={Denials} />
        <Route path="/join" component={Join} />
        <Route path="/forum" component={Forum} />
        <Route path="/remix" component={Remix} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
