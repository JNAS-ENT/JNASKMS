import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { loginSchema, LoginInput } from '../validation/schema';
import { useAuth } from '../hooks/useAuth';
import { useEnterpriseStore } from '../../../store';

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const { navigateTo } = useEnterpriseStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: 'shaikh.jnas@gmail.com',
      password: 'password123',
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div id="login-card" className="w-full max-w-md p-8 bg-card text-card-foreground rounded-2xl border border-border shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary text-primary-foreground mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Access Command Center</h1>
        <p className="text-sm text-muted-foreground">Sign in to your enterprise developer workstation</p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="login-email">
            Corporate Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="login-email"
              type="email"
              {...register('email')}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. shaikh.jnas@gmail.com"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="login-password">
              Security Key
            </label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="login-password"
              type="password"
              {...register('password')}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          id="btn-login-submit"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating Credentials...
            </>
          ) : (
            <>
              Initialize Session
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Need a secure corporate workspace?{' '}
          <button
            id="btn-goto-register"
            onClick={() => navigateTo('register')}
            className="font-semibold text-foreground hover:underline focus:outline-none"
          >
            Request Access Provisioning
          </button>
        </p>
      </div>
    </div>
  );
}
