import { LoginForm } from "./LoginForm";
import Logo from "@/components/ui/logo";

const Login = () => {




  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2">
            <Logo size="xl" showText={false} />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative p-4 hidden lg:block">
          <div className="bg-muted rounded-xl block w-full h-full flex flex-col justify-center p-10">
            <div className="text-center">
              <h1 className="text-4xl font-semibold text-balance tracking-tighter">Track all your favorite anime from all platforms in one single place</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;