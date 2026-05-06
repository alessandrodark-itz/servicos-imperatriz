type Props = {
  text: string
  variant?: 'default' | 'featured' | 'sponsored'
}

export default function Badge({ text, variant = 'default' }: Props) {
  const variants = {
    default: 'bg-violet-500/20 text-violet-400',
    featured: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white',
    sponsored: 'bg-orange-500/20 text-orange-400',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}>
      {text}
    </span>
  )
}
