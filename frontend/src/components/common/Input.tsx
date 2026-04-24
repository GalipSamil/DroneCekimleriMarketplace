import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: LucideIcon;
    error?: FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, icon: Icon, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300 ml-1">{label}</label>
                <div className="relative group">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    )}
                    <input
                        ref={ref}
                        {...props}
                        className={`block w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-slate-800/40 border ${
                            error ? 'border-red-500/50' : 'border-slate-700/80'
                        } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 ${
                            error ? 'focus:ring-red-500/40 focus:border-red-500/40' : 'focus:ring-blue-500/40 focus:border-blue-500/40'
                        } transition-all font-medium hover:bg-slate-800/60`}
                    />
                </div>
                {error && <span className="text-red-400 text-xs font-medium ml-1 block">{error.message}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
