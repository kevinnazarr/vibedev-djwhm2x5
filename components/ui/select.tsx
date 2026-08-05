"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps
  extends Omit<ComponentProps<"button">, "value" | "onChange" | "children"> {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: "default" | "sm";
  /** Custom content for each listbox option. */
  renderOption?: (option: SelectOption) => ReactNode;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  size = "default",
  className,
  renderOption,
  ...buttonProps
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options.find((option) => option.value === value);

  function openListbox() {
    if (buttonProps.disabled) return;
    setHighlighted(selectedIndex);
    setOpen(true);
  }

  function closeListbox() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function selectOption(option: SelectOption) {
    onChange(option.value);
    closeListbox();
  }

  // Close on outside interaction.
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        closeListbox();
      }
    }
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  // Keep the highlighted option focused while the list is open.
  useEffect(() => {
    if (open) {
      optionRefs.current[highlighted]?.focus();
    }
  }, [open, highlighted]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          setHighlighted((h) => Math.min(h + 1, options.length - 1));
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openListbox();
        } else {
          setHighlighted((h) => Math.max(h - 1, 0));
        }
        break;
      // Enter/Space are intentionally not handled here: they activate the
      // trigger/option buttons natively (click), which toggles or selects.
      case "Escape":
        closeListbox();
        break;
      case "Tab":
        closeListbox();
        break;
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={buttonProps["aria-label"]}
        aria-labelledby={buttonProps["aria-labelledby"]}
        onKeyDown={handleKeyDown}
        onClick={() => (open ? closeListbox() : openListbox())}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent text-sm font-medium shadow-sm transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          size === "default" ? "h-10 px-3" : "h-8 px-2.5 text-xs",
          open && "ring-2 ring-ring",
          className,
        )}
        {...buttonProps}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {selected ? renderOption?.(selected) ?? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label={buttonProps["aria-label"]}
            onKeyDown={handleKeyDown}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 origin-top overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg shadow-black/10"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlighted;
              return (
                <button
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                    isHighlighted && "bg-accent",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <span className="block truncate">{option.label}</span>
                    )}
                    {option.description && !renderOption && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <Check className="size-4 shrink-0 text-primary" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
