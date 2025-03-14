import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

// import type React from "react"

// type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
// type ButtonSize = "sm" | "md" | "lg"

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant
//   size?: ButtonSize
//   isLoading?: boolean
//   leftIcon?: React.ReactNode
//   rightIcon?: React.ReactNode
//   fullWidth?: boolean
// }

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = "primary",
//   size = "md",
//   isLoading = false,
//   leftIcon,
//   rightIcon,
//   fullWidth = false,
//   className = "",
//   disabled,
//   ...props
// }) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

//   const variantClasses = {
//     primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
//     secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
//     outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
//     ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
//     danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
//   }

//   const sizeClasses = {
//     sm: "h-9 px-3 text-xs",
//     md: "h-10 px-4 py-2",
//     lg: "h-11 px-8 text-base",
//   }

//   const widthClass = fullWidth ? "w-full" : ""

//   return (
//     <button
//       className={`
//         ${baseClasses}
//         ${variantClasses[variant]}
//         ${sizeClasses[size]}
//         ${widthClass}
//         ${className}
//       `}
//       disabled={disabled || isLoading}
//       {...props}
//     >
//       {isLoading && (
//         <svg
//           className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           ></path>
//         </svg>
//       )}

//       {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
//       {children}
//       {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
//     </button>
//   )
// }

// export default Button

