// "use client"

// import * as React from "react"
// import * as LabelPrimitive from "@radix-ui/react-label"

// import { cn } from "@/lib/utils"

// function Label({
//   className,
//   ...props
// }: React.ComponentProps<typeof LabelPrimitive.Root>) {
//   return (
//     <LabelPrimitive.Root
//       data-slot="label"
//       className={cn(
//         "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Label }
import type React from "react"
import { forwardRef } from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, fullWidth = false, className = "", ...props }, ref) => {
    const textareaClasses = `
      flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm
      placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
      ${error ? "border-destructive focus-visible:ring-destructive" : ""}
      ${className}
    `

    const widthClass = fullWidth ? "w-full" : ""

    return (
      <div className={`${widthClass}`}>
        {label && (
          <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea ref={ref} className={textareaClasses} {...props} />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"

export default Textarea

