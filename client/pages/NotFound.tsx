import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout showSidebar={false}>
      <div className="px-4 md:px-8 py-16 md:py-32 max-w-4xl mx-auto flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get
              you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/">
              <Button className="bg-wellness-500 hover:bg-wellness-600 text-white px-8 py-6 text-base h-auto">
                Go Home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="border-wellness-300 text-wellness-600 hover:bg-wellness-50 px-8 py-6 text-base h-auto"
              >
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
