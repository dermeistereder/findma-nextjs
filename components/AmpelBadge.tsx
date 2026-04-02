import { Ampel } from '@/lib/types'

const config = {
  green: {
    label: 'Österreich',
    flag: '🇦🇹',
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  yellow: {
    label: 'Europa',
    flag: '🇪🇺',
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400',
  },
  red: {
    label: 'International',
    flag: '🌍',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200',
    dot: 'bg-orange-400',
  },
}

interface Props {
  ampel: Ampel
  size?: 'sm' | 'md' | 'lg'
  showFlag?: boolean
}

export default function AmpelBadge({ ampel, size = 'sm', showFlag = true }: Props) {
  const c = config[ampel]
  const sizeClass = size === 'lg'
    ? 'text-sm px-3 py-1.5 gap-2'
    : size === 'md'
    ? 'text-xs px-2.5 py-1 gap-1.5'
    : 'text-xs px-2 py-0.5 gap-1'

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${c.bg} ${c.text} ${c.border} ${sizeClass}`}>
      {showFlag && <span>{c.flag}</span>}
      <span>{c.label}</span>
    </span>
  )
}
