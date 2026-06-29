import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Mail, Lock, Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { registerSchema, RegisterInput } from '../validation/schema';
import { useAuth } from '../hooks/useAuth';
import { useEnterpriseStore } from '../../../store';

export function RegisterForm() {
  const { register: signup, isLoading, error } = useAuth();
  const { navigateTo } = useEnterpriseStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = (data: RegisterInput) => {
    signup(data);
  };

  return (
    <div id="register-card" className="w-full max-w-md p-8 bg-card text-card-foreground rounded-2xl border border-border shadow-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary text-primary-foreground mb-2">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-display tracking-tight">Provision Client Access</h1>
        <p className="text-sm text-muted-foreground">Register an isolated workstation container</p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="register-name">
            Workstation Operator Name
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="register-name"
              type="text"
              {...register('fullName')}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. Sarah Connor"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="register-email">
            Corporate Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="register-email"
              type="email"
              {...register('email')}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g. sarah@enterprise.com"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="register-password">
            Access Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="register-password"
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

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider" htmlFor="register-role">
            Workstation Role Type
          </label>
          <select
            id="register-role"
            {...register('role')}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="user">User Operator (Default)</option>
            <option value="editor">Editor (Write Access)</option>
            <option value="admin">Systems Administrator</option>
          </select>
          {errors.role && (
            <p className="text-xs text-destructive mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          id="btn-register-submit"
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Provisioning Workspace Container...
            </>
          ) : (
            <>
              Provision Station
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Workstation already configured?{' '}
          <button
            id="btn-goto-login"
            onClick={() => navigateTo('login')}
            className="font-semibold text-foreground hover:underline focus:outline-none"
          >
            Access Terminal Console
          </button>
        </p>
      </div>
    </div>
  );
}
