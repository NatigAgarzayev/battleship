import { ShipType } from '@/constants/ships'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

interface ShipProps {
    ship: ShipType
    isPlaced?: boolean
}

export default function Ship({ ship, isPlaced = false }: ShipProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `ship-${ship.id}`,
        data: ship,
        disabled: isPlaced
    })

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    }

    // Width based on ship length (each cell is 48px in the new design)
    const widths = {
        2: 'w-24',   // 2 * 12 * 4 (Tailwind spacing)
        3: 'w-36',   // 3 * 12 * 4
        4: 'w-48',   // 4 * 12 * 4
        5: 'w-60'    // 5 * 12 * 4
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                bg-[#2563eb] rounded-full h-8 flex items-center px-4 text-white text-xs font-semibold
                ${widths[ship.length as keyof typeof widths]}
                ${isPlaced ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
            `}
        >
        </div>
    )
}