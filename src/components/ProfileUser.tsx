import {
    LogOut,
    MoveUpRight,
    Settings,
    CreditCard,
    FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MenuItem {
    label: string;
    value?: string;
    href: string;
    icon?: React.ReactNode;
    external?: boolean;
}

interface ProfileUserProps {
    name: string;
    role: string;
    avatar: string;
    subscription?: string;
    actionLogout?: () => void;
}

const defaultProfile = {
    name: "John Doe",
    role: "Programador",
    avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
    subscription: "Free",
    actionLogout: function (): void {
        throw new Error("Function not implemented.");
    }
} satisfies Required<ProfileUserProps>;

export default function ProfileUser({
    name = defaultProfile.name,
    role = defaultProfile.role,
    avatar = defaultProfile.avatar,
    subscription = defaultProfile.subscription,
    actionLogout = defaultProfile.actionLogout,
}: Partial<ProfileUserProps> = defaultProfile) {
    const menuItems: MenuItem[] = [
        {
            label: "Assinatura",
            value: subscription,
            href: "#",
            icon: <CreditCard className="w-4 h-4" />,
            external: false,
        },
        {
            label: "Configurações",
            href: "#",
            icon: <Settings className="w-4 h-4" />,
        },
        {
            label: "Termos & Politicas",
            href: "#",
            icon: <FileText className="w-4 h-4" />,
            external: true,
        },
    ];

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
                <div className="relative px-6 pt-12 pb-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative shrink-0">
                            <Image
                                src={avatar}
                                alt={name}
                                width={72}
                                height={72}
                                className="rounded-full ring-4 ring-white dark:ring-zinc-900 object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                                {name}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                {role}
                            </p>
                        </div>
                    </div>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
                    <div className="space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                    rounded-lg transition-colors duration-200"
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {item.label}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {item.value && (
                                        <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-2">
                                            {item.value}
                                        </span>
                                    )}
                                    {item.external && (
                                        <MoveUpRight className="w-4 h-4" />
                                    )}
                                </div>
                            </Link>
                        ))}

                        <button
                            onClick={actionLogout}
                            type="button"
                            className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                rounded-lg transition-colors duration-200 cursor-pointer"
                        >
                            <div  className="flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    Sair
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
