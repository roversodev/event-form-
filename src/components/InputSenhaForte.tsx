"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X } from "lucide-react";

const passwordRequirements = [
    { label: "8+ caracteres", test: (v: string) => v.length >= 8 },
    { label: "Número", test: (v: string) => /\d/.test(v) },
    { label: "Letra minúscula", test: (v: string) => /[a-z]/.test(v) },
    { label: "Letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
    {
        label: "Caractere especial (!@#$)",
        test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
    },
] as const;

interface InputSenhaForteProps {
    value: string;
    onChange: (value: string) => void;
}

export default function InputSenhaForte({ value, onChange }: InputSenhaForteProps) {
    const [showPassword, setShowPassword] = useState(false);

    const getStrength = (value: string): number => {
        if (!value) return 0;
        return (
            passwordRequirements.filter((req) => req.test(value)).length * 20
        );
    };

    const strength = getStrength(value);
    const strengthLabel =
        strength <= 40 ? "Fraca" : strength <= 80 ? "Média" : "Forte";

    return (
        <div className="w-full space-y-2">
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Digite sua senha"
                    className={cn(
                        "w-full px-3 py-2 pr-10",
                        "rounded-md border",
                        "bg-white dark:bg-black/5",
                        "border-zinc-200 dark:border-zinc-800",
                        "focus:outline-hidden focus:ring-2",
                        "focus:ring-zinc-900/20 dark:focus:ring-zinc-100/20"
                    )}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2
                    text-zinc-400 hover:text-zinc-900 
                    dark:text-zinc-500 dark:hover:text-zinc-100
                    transition-colors cursor-pointer"
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </button>
            </div>

            {value && (
                <div className="space-y-1">
                    <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <div
                            className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300"
                            style={{ width: `${strength}%` }}
                        />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Força: <span className="font-medium">{strengthLabel}</span>
                    </p>
                </div>
            )}

            <div className="space-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                {passwordRequirements.map(({ label, test }) => (
                    <div key={label} className="flex items-center gap-2">
                        {test(value) ? (
                            <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                        ) : (
                            <X className="w-3.5 h-3.5" />
                        )}
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
