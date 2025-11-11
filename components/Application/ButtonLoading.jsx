import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from '@/lib/utils'

const ButtonLoading = ({ type, text, loading, onClick, className, ...props }) => {
    return (

        <Button 

            type={type}
            disabled={loading}
            onClick={onClick}
            className={cn("cursor-pointer", className)}
            {...props}>

            {loading &&
                <Loader2 className="animate-spin" />
            }

            {text}
        </Button>

    )
}

export default ButtonLoading
