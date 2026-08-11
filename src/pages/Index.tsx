import { useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/lib/auth";

const Login = lazy(() => import("./Login"));
const Dashboard = lazy(() => import("./Dashboard"));

const LoadingFallback = () => (
  <div className="flex min-h-[calc(100vh-57px)] items-center justify-center">
    <div className="text-muted-foreground">Caricamento...</div>
  </div>
);

const Index = () => {
  const { isLoggedIn, loading, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </Suspense>
  );
};

export default Index;
