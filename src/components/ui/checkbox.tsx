import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
  }
>(({ className, label, checked, ...props }, ref) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          {...props}
        />
        <div className={cn(
          "w-4 h-4 border border-gray-300 rounded flex items-center justify-center",
          checked ? "bg-green-600 border-green-600" : "bg-white",
          className
        )}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
