// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//         "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }
import type React from "react"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = "", ...props }, ref) => {
    const inputClasses = `
      flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
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
        <input ref={ref} className={inputClasses} {...props} />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input

