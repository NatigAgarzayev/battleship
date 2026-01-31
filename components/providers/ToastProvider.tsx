'use client'
import { Toaster } from 'sonner'

export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-center"
            expand={false}
            richColors
            toastOptions={{
                style: {
                    background: 'white',
                    border: '2px solid #bae6fd',
                    borderRadius: '1rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                },
                className: 'font-sans',
            }}
        />
    )
}