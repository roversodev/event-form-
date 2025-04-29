import { withAuth } from "next-auth/middleware"
import { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {},
  {
    pages: {
      signIn: "/login",
    },
  }
)

// Protege tudo, exceto:
// - / (home)
// - /api (rotas de API)
// - /uploads (arquivos públicos)
// - /events/:eventId/form (formulário público)
// - arquivos estáticos (_next/static, _next/image, favicon.ico)
export const config = {
  matcher: [
    "/((?!api|uploads|_next/static|_next/image|favicon.ico|events/[^/]+/form|$).*)"
  ],
}
