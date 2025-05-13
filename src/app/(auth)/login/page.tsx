"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSupabase } from "@/providers/SupabaseProvider"
import { Separator } from "@/components/ui/separator"

const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .min(1, 'Email é obrigatório'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha muito longa')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const supabase = useSupabase()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }

    checkSession()
  }, [router, supabase.auth])

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setLoading(true)
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirme seu email antes de fazer login')
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos')
        } else {
          toast.error(error.message)
        }
        return
      }

      if (!authData.user) {
        toast.error('Erro ao fazer login. Tente novamente.')
        return
      }

      // Aguarda a atualização da sessão antes de redirecionar
      await supabase.auth.getSession()

      toast.success('Login realizado com sucesso')
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast.error('Erro ao fazer login')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSocialLogin(provider: 'google') {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(`Erro ao fazer login com ${provider}`)
      }
    } catch (error) {
      toast.error('Erro ao fazer login')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 p-6 bg-card rounded-xl shadow-sm border">
        <div className="text-center">
        <h1 className="mb-1 mt-4 text-xl font-semibold">Entrar em <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">EventFlow+</span></h1>
          <p className="text-muted-foreground ">
            Acesse sua conta para gerenciar seus formulários
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Form>

        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Separator className="border-dashed" />
          <span className="text-muted-foreground text-xs">Ou continue com</span>
          <Separator className="border-dashed" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={loading}
          className="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
            <path
              fill="#4285f4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            ></path>
            <path
              fill="#34a853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            ></path>
            <path
              fill="#fbbc05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            ></path>
            <path
              fill="#eb4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            ></path>
          </svg>
          <span>Google</span>
        </Button>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}