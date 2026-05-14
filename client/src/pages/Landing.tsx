import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Lock, Users } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" data-testid="icon-shield" />
            <h1 className="text-xl font-bold" data-testid="text-company-name">Profit Pilot</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/register")} data-testid="button-register">
              Register
            </Button>
            <Button onClick={() => setLocation("/login")} data-testid="button-login">
              Log In
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" data-testid="text-hero-title">
            Business Profit & Expense Tracker
          </h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-hero-description">
            Track income, monitor expenses, and visualize your financial data in real-time.
            Secure access for your entire team.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="outline" onClick={() => setLocation("/register")} data-testid="button-register-hero">
              Register
            </Button>
            <Button size="lg" onClick={() => setLocation("/login")} data-testid="button-get-started">
              Log In
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card data-testid="card-feature-1">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-2" data-testid="icon-trending" />
              <CardTitle>Track Finances</CardTitle>
              <CardDescription>
                Monitor income from student enrollments and partnerships. Track expenses like marketing, salaries, and tools.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-2">
            <CardHeader>
              <Lock className="w-10 h-10 text-primary mb-2" data-testid="icon-lock" />
              <CardTitle>Secure Access</CardTitle>
              <CardDescription>
                Protected authentication ensures only authorized team members can view and manage financial data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-3">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" data-testid="icon-users" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Multiple users can add transactions and view shared financial insights with automatic profit calculations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto" data-testid="card-cta">
            <CardHeader>
              <CardTitle>Ready to start tracking?</CardTitle>
              <CardDescription>
                Log in to access your financial dashboard and start managing your business finances.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setLocation("/register")} size="lg" data-testid="button-register-cta">
                Register
              </Button>
              <Button onClick={() => setLocation("/login")} size="lg" data-testid="button-login-cta">
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p data-testid="text-footer">© 2025 Profit Pilot. Cybersecurity Training Organization.</p>
        </div>
      </footer>
    </div>
  );
}
