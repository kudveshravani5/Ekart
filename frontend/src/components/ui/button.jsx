import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
// ========== FILE: src/components/ui/Button.jsx ==========
// Reusable button components - ALL TAILWIND


// ========== PRIMARY BUTTON ==========
export const ButtonPrimary = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-primary-600 
        text-white 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-colors duration-200
        hover:bg-primary-700
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== SECONDARY BUTTON ==========
export const ButtonSecondary = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-gray-200 
        text-gray-800 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-colors duration-200
        hover:bg-gray-300
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== GESTURE BUTTON ==========
export const ButtonGesture = ({ children, onClick, active = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        ${active ? 'bg-gesture-active' : 'bg-gesture-inactive'}
        text-white 
        px-4 py-2 
        rounded-full 
        font-medium
        transition-all duration-200
        hover:scale-105
        ${active ? 'hover:bg-green-600' : 'hover:bg-gray-600'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== DANGER BUTTON ==========
export const ButtonDanger = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-danger 
        text-white 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-colors duration-200
        hover:bg-danger-600
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== WARNING BUTTON ==========
export const ButtonWarning = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-warning 
        text-white 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-colors duration-200
        hover:bg-warning-600
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== OUTLINE BUTTON ==========
export const ButtonOutline = ({ children, onClick, disabled = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-transparent 
        border-2 border-primary 
        text-primary 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-all duration-200
        hover:bg-primary hover:text-white
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// ========== ICON BUTTON ==========
export const ButtonIcon = ({ icon, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 
        flex items-center justify-center
        rounded-full 
        bg-gray-100
        text-gray-700
        transition-all duration-200
        hover:bg-gray-200 hover:scale-110
        ${className}
      `}
    >
      {icon}
    </button>
  );
};

// ========== LOADING BUTTON ==========
export const ButtonLoading = ({ children, loading = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        bg-primary-600 
        text-white 
        px-6 py-3 
        rounded-lg 
        font-semibold
        transition-colors duration-200
        hover:bg-primary-700
        disabled:opacity-50 
        disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading && (
        <div className="
          animate-spin 
          rounded-full 
          h-4 w-4 
          border-b-2 border-white
        " />
      )}
      {children}
    </button>
  );
};

// ========== DEFAULT EXPORT ==========
export default ButtonPrimary;

// ========== HOW TO USE ==========
/*
import Button, { 
  ButtonPrimary, 
  ButtonSecondary, 
  ButtonGesture,
  ButtonDanger,
  ButtonOutline,
  ButtonLoading
} from './components/ui/Button';

// Usage:
<ButtonPrimary onClick={handleClick}>
  Click Me
</ButtonPrimary>

<ButtonGesture active={isActive} onClick={toggleGesture}>
  ✋ Gesture Control
</ButtonGesture>

<ButtonLoading loading={isLoading} onClick={handleSubmit}>
  Submit
</ButtonLoading>
*/
