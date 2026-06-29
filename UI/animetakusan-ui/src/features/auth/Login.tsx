import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import Logo from "@/components/ui/logo";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

const Login = () => {

  const [ selectedTab, setSelectedTab ] = useState<'login' | 'signup'>('login');

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <Logo size="xl" showText={false} />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs">
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'login' | 'signup')} className="p-4 gap-6">
              <TabsList className="w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm setSelectedTab={setSelectedTab} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="relative p-4 hidden lg:block">
        <div className="bg-muted rounded-xl block w-full h-full flex flex-col gap-6 justify-center p-30">
          <h1 className="text-4xl font-semibold tracking-tighter">Track all your favorite anime from all platforms in one single place.</h1>
          <p className="text-balance">An open-source anime tracking app to log watched shows and journal your anime journey.</p>
        </div>
      </div>
    </div>
  );
}
export default Login;