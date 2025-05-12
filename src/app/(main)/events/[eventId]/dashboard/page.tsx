'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Users, CalendarCheck, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSupabase } from '@/providers/SupabaseProvider';



interface DashboardStats {
    totalResponses: number;
    dailyResponses: {
        date: string;
        count: number;
    }[];
    checkInStats: {
        total: number;
        completed: number;
        percentage: number;
    };
    responsesByHour: {
        hour: number;
        count: number;
    }[];
}

export default function EventDashboard() {
    const { eventId } = useParams();
    const [selectedPeriod, setSelectedPeriod] = React.useState('all');
    const supabase = useSupabase();
    const router = useRouter();

    const { data: event, isLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
         
            if (!session) {
                router.push('/login');
                return [];
            }
            const response = await fetch(`/api/events/${eventId}?includeResponses=true`);
            if (!response.ok) throw new Error('Erro ao carregar evento');
            return response.json();
        },
        // Adiciona refetch automático a cada 30 segundos
        refetchInterval: 30000,
        // Também refetch quando a janela recupera o foco
        refetchOnWindowFocus: true
    });

    const calculateStats = (responses: any[], period: string): DashboardStats => {
        const today = new Date();
        let filteredResponses = [...responses];

        // Filtra as respostas baseado no período selecionado
        if (period === 'today') {
            filteredResponses = responses.filter(response => {
                const responseDate = new Date(response.created_at);
                return isSameDay(responseDate, today);
            });
        } else if (period !== 'all') {
            const daysToSubtract = parseInt(period);
            const startDate = new Date();
            startDate.setDate(today.getDate() - daysToSubtract);
            
            filteredResponses = responses.filter(response => {
                const responseDate = new Date(response.created_at);
                return responseDate >= startDate;
            });
        }

        const totalResponses = filteredResponses.length;

        // Agrupa respostas por dia
        const responsesByDay = filteredResponses.reduce((acc, response) => {
            const date = new Date(response.created_at).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Calcula check-ins
        const checkedInCount = filteredResponses.filter(r => r.checked_in).length;

        // Agrupa por hora do dia
        const responsesByHour = filteredResponses.reduce((acc, response) => {
            const hour = new Date(response.created_at).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            totalResponses,
            dailyResponses: Object.entries(responsesByDay)
                .map(([date, count]) => ({ date, count: count as number }))
                .sort((a, b) => a.date.localeCompare(b.date)),
            checkInStats: {
                total: totalResponses,
                completed: checkedInCount,
                percentage: totalResponses > 0 ? (checkedInCount / totalResponses) * 100 : 0
            },
            responsesByHour: Array.from({ length: 24 }, (_, hour) => ({
                hour,
                count: responsesByHour[hour] || 0
            }))
        };
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-[400px]" />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-destructive">Evento não encontrado</p>
            </div>
        );
    }

    const stats = calculateStats(event.responses || [], selectedPeriod);
    const todayResponses = stats.dailyResponses.find(
        day => isSameDay(parseISO(day.date), new Date())
    )?.count || 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/events/${eventId}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: event.primary_color }}>
                        Dashboard: {event.title}
                    </h1>
                    <p className="text-muted-foreground">{event.description}</p>
                </div>
            </div>


            <div className="flex justify-end gap-4 mb-4">
                <Select 
                    defaultValue="all" 
                    onValueChange={(value) => setSelectedPeriod(value)}
                >
                    <SelectTrigger className="w-[180px] cursor-pointer">
                        <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today" className='cursor-pointer'>Hoje</SelectItem>
                        <SelectItem value="7" className='cursor-pointer'>Últimos 7 dias</SelectItem>
                        <SelectItem value="15" className='cursor-pointer'>Últimos 15 dias</SelectItem>
                        <SelectItem value="30" className='cursor-pointer'>Últimos 30 dias</SelectItem>
                        <SelectItem value="90" className='cursor-pointer'>Últimos 3 meses</SelectItem>
                        <SelectItem value="all" className='cursor-pointer'>Todo período</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Inscritos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: event.primary_color }}>
                            {stats.totalResponses}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            pessoas registradas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Check-ins Realizados</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: event.accent_color }}>
                            {stats.checkInStats.completed}
                        </div>
                        <Progress
                            value={stats.checkInStats.percentage}
                            className="my-2"
                            style={{
                                background: `linear-gradient(to right, ${event.primary_color}, ${event.accent_color})`
                            }}
                        />
                        <p className="text-xs text-muted-foreground">
                            {stats.checkInStats.percentage.toFixed(1)}% do total
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inscrições Hoje</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: event.primary_color }}>
                            {todayResponses}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            novos registros
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Horário Mais Popular</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: event.accent_color }}>
                            {stats.responsesByHour.reduce((max, curr) =>
                                curr.count > max.count ? curr : max
                            ).hour}h
                        </div>
                        <p className="text-xs text-muted-foreground">
                            maior volume de inscrições
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Inscrições por Dia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.dailyResponses.map((day) => (
                                <div key={day.date} className="flex items-center gap-2">
                                    <div className="text-sm text-muted-foreground w-24">
                                        {format(parseISO(day.date), "dd/MM", { locale: ptBR })}
                                    </div>
                                    <div
                                        className="flex-1 h-2 rounded-full"
                                        style={{
                                            background: `linear-gradient(to right, ${event.primary_color}, ${event.accent_color})`,
                                            opacity: 0.2 + (day.count / Math.max(...stats.dailyResponses.map(d => d.count))) * 0.8
                                        }}
                                    />
                                    <div className="text-sm font-medium w-12 text-right">
                                        {day.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição por Horário</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={stats.responsesByHour}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 0,
                                        bottom: 20,
                                    }}
                                >
                                    <XAxis
                                        dataKey="hour"
                                        tickFormatter={(hour) => `${hour}h`}
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Horário
                                                                </span>
                                                                <span className="font-bold text-muted-foreground">
                                                                    {payload[0].payload.hour}h
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                                    Inscrições
                                                                </span>
                                                                <span className="font-bold">
                                                                    {payload[0].value}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        radius={[4, 4, 0, 0]}
                                        style={{
                                            fill: `url(#gradient)`,
                                            opacity: 0.9,
                                        }}
                                    />
                                    <defs>
                                        <linearGradient
                                            id="gradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor={event.primary_color}
                                                stopOpacity={1}
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor={event.accent_color}
                                                stopOpacity={0.8}
                                            />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Insights do Evento</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-4 w-4" style={{ color: event.primary_color }} />
                                    <CardTitle className="text-sm">Melhor Dia</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {stats.dailyResponses.reduce((max, curr) =>
                                    curr.count > max.count ? curr : max
                                ).date && (
                                        <>
                                            <p className="text-lg font-semibold">
                                                {format(parseISO(stats.dailyResponses.reduce((max, curr) =>
                                                    curr.count > max.count ? curr : max
                                                ).date), "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                com {stats.dailyResponses.reduce((max, curr) =>
                                                    curr.count > max.count ? curr : max
                                                ).count} inscrições
                                            </p>
                                        </>
                                    )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" style={{ color: event.accent_color }} />
                                    <CardTitle className="text-sm">Tendência</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {stats.dailyResponses.length > 1 && (
                                    <p className="text-sm">
                                        {stats.dailyResponses[stats.dailyResponses.length - 1].count >
                                            stats.dailyResponses[stats.dailyResponses.length - 2].count
                                            ? "Crescimento nas inscrições"
                                            : "Redução nas inscrições"}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
