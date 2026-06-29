import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSettings } from '../hooks/useSettings';
import { configSchema, ConfigInput } from '../validation/schema';
import { Settings, User, Bell, Cpu, Key, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function SettingsPanel() {
  const { config, updateConfig, isSaving } = useSettings();
  const [successMsg, setSuccessMsg] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ConfigInput>({
    resolver: zodResolver(configSchema) as any,
    defaultValues: {
      theme: config.theme,
      emailNotifications: config.emailNotifications,
      pushNotifications: config.pushNotifications,
      aiModelPreference: config.aiModelPreference,
      enterpriseApiKey: config.enterpriseApiKey || ''
    }
  });

  const activeTheme = watch('theme');
  const activeEmail = watch('emailNotifications');
  const activePush = watch('pushNotifications');

  const onSubmit = async (data: ConfigInput) => {
    setSuccessMsg(false);
    try {
      await updateConfig({
        theme: data.theme,
        emailNotifications: data.emailNotifications,
        pushNotifications: data.pushNotifications,
        aiModelPreference: data.aiModelPreference,
        enterpriseApiKey: data.enterpriseApiKey
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div id="settings-module-view" className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Station Console Settings
        </h2>
        <p className="text-xs text-muted-foreground">Configure global options, model weights, notification hooks, and secure enterprise keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Quick Help Column */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm flex items-center gap-2 border-b border-border pb-3">
            <User className="w-4.5 h-4.5 text-blue-500" />
            Station Identity Profile
          </h3>
          <div className="space-y-3 text-xs leading-relaxed">
            <p className="text-muted-foreground">
              These settings configure the localized behavior of your sandbox workstation container.
            </p>
            <div className="p-3 bg-secondary rounded-lg font-mono text-[10px] space-y-1">
              <div><span className="font-bold text-foreground">Container SHA:</span> node-c81b9e2f</div>
              <div><span className="font-bold text-foreground">Ingress IP:</span> 127.0.0.1:3000</div>
              <div><span className="font-bold text-foreground">Provider:</span> AI Studio Host</div>
            </div>
          </div>
        </div>

        {/* Configuration settings form (Takes 2 columns) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Visual themes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Settings className="w-4 h-4 text-muted-foreground" />
                Visual Theme Preference
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  id="btn-settings-theme-light"
                  type="button"
                  onClick={() => setValue('theme', 'light')}
                  className={`p-4 border rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                    activeTheme === 'light'
                      ? 'border-primary bg-secondary/30 ring-2 ring-primary/10'
                      : 'border-border bg-transparent text-muted-foreground hover:bg-secondary/40'
                  }`}
                >
                  <span className="text-lg">☀️</span>
                  Corporate Light Theme
                </button>
                <button
                  id="btn-settings-theme-dark"
                  type="button"
                  onClick={() => setValue('theme', 'dark')}
                  className={`p-4 border rounded-xl text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                    activeTheme === 'dark'
                      ? 'border-primary bg-secondary/30 ring-2 ring-primary/10'
                      : 'border-border bg-transparent text-muted-foreground hover:bg-secondary/40'
                  }`}
                >
                  <span className="text-lg">🌙</span>
                  Technical Dark Theme
                </button>
              </div>
            </div>

            {/* Notification triggers */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                Notification Webhooks
              </h4>
              <div className="space-y-3">
                {/* Email notifications checkbox */}
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40">
                  <div className="space-y-0.5">
                    <label className="text-xs font-semibold text-foreground cursor-pointer" htmlFor="settings-check-email">
                      Email Audits Weekly
                    </label>
                    <p className="text-[10px] text-muted-foreground">Deliver station audits to corporate inbox weekly.</p>
                  </div>
                  <input
                    id="settings-check-email"
                    type="checkbox"
                    checked={activeEmail}
                    onChange={(e) => setValue('emailNotifications', e.target.checked)}
                    className="w-4.5 h-4.5 accent-primary cursor-pointer"
                  />
                </div>

                {/* Push notifications checkbox */}
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/40">
                  <div className="space-y-0.5">
                    <label className="text-xs font-semibold text-foreground cursor-pointer" htmlFor="settings-check-push">
                      Immediate Browser Alerts
                    </label>
                    <p className="text-[10px] text-muted-foreground">Display push notifications for priority tasks.</p>
                  </div>
                  <input
                    id="settings-check-push"
                    type="checkbox"
                    checked={activePush}
                    onChange={(e) => setValue('pushNotifications', e.target.checked)}
                    className="w-4.5 h-4.5 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* AI Settings */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-muted-foreground" />
                Generative Model Weights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="settings-model-preference">
                    Model Preference
                  </label>
                  <select
                    id="settings-model-preference"
                    {...register('aiModelPreference')}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Optimized Speed)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Optimized Context)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider" htmlFor="settings-api-key">
                    Model API Key Credential
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      id="settings-api-key"
                      type="password"
                      {...register('enterpriseApiKey')}
                      placeholder="••••••••••••••••••••••••"
                      className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
              {successMsg ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in duration-200">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Configurations flushed to storage layer successfully!
                </div>
              ) : (
                <div />
              )}
              <button
                id="btn-settings-save"
                type="submit"
                disabled={isSaving}
                className="py-2 px-6 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Flushing...
                  </>
                ) : (
                  'Commit Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
