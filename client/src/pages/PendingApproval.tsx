import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function PendingApproval() {
  const { user, logout } = useAuth();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
          </div>
          <CardTitle className="text-2xl" data-testid="text-pending-title">Account Pending Approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground" data-testid="text-pending-message">
              Thank you for registering, <span className="font-medium">{user?.firstName || user?.email}</span>!
            </p>
            <p className="text-muted-foreground">
              Your account is currently awaiting approval from an administrator. You'll be able to access the application once your account is approved.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">What's next?</p>
                <p className="text-muted-foreground">
                  An administrator will review your request shortly. You may close this page and check back later.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={logout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>Questions? Contact your administrator.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
