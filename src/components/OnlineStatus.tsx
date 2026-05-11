'use client'

interface Props {
  status: 'online' | 'recent' | null
  variant?: 'card' | 'profile'
}

export default function OnlineStatus({ status, variant = 'card' }: Props) {
  if (!status) return null

  const isOnline = status === 'online'
  const label = isOnline ? 'Online agora' : 'Ativo recentemente'
  const dotColor = isOnline ? '#22c55e' : '#f59e0b'
  const title = 'Indica presença na plataforma — não indica disponibilidade para serviços'

  if (variant === 'card') {
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-medium"
        style={{ color: dotColor }}
        title={title}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: dotColor }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: dotColor }}
          />
        </span>
        {label}
      </span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: isOnline ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
        border: `1px solid ${isOnline ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
        color: dotColor,
      }}
      title={title}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ background: dotColor }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ background: dotColor }}
        />
      </span>
      {label}
    </span>
  )
}
