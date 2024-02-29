import { Loader } from 'lucide-react'

export const Loading = () => {
    return (
        <div className="absolute left-0 top-0 z-40 w-screen h-screen bg-[#0A0A0A] flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin" />
        </div>
    )
}
