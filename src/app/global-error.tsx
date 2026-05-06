'use client'

import React from 'react'

// Workaround: Next.js 16 + React 19 — ReactSharedInternals.H is null during
// SSR static prerender when a 'use client' component renders <html>/<body>.
// React 19 changed: dispatcher moved to .H; internal renamed to
// __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
if (typeof window === 'undefined') {
  type Ctx = { _currentValue?: unknown; _currentValue2?: unknown }
  const _r = React as unknown as Record<string, unknown>
  const _int = (_r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
    _r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) as Record<string, unknown> | undefined
  if (_int && !_int.H) {
    // A Proxy that satisfies invariant checks by returning a truthy stub for
    // any context whose default value is null (e.g. Next.js's LayoutRouterContext)
    const ctxStub: Record<string, unknown> = new Proxy({} as Record<string, unknown>, {
      get: () => ctxStub,
      apply: () => ctxStub,
    })
    _int.H = new Proxy({} as Record<string, unknown>, {
      get(_t, prop: string) {
        if (prop === 'readContext' || prop === 'useContext')
          return (ctx: Ctx) => {
            const v = ctx?._currentValue ?? ctx?._currentValue2
            return v !== null && v !== undefined ? v : ctxStub
          }
        if (prop === 'useState')
          return (init: unknown) =>
            [typeof init === 'function' ? (init as () => unknown)() : init, () => {}]
        if (prop === 'useMemo') return (fn: () => unknown) => fn()
        if (prop === 'useRef') return (init: unknown) => ({ current: init })
        if (prop === 'useCallback') return (fn: unknown) => fn
        if (prop === 'useId') return () => ':r0:'
        return () => null
      },
    })
  }
}

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#05010a] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Algo deu errado</h2>
          <button
            onClick={reset}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
