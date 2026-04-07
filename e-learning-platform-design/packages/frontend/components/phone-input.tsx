"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const countries = [
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "+56", name: "Chile", flag: "🇨🇱" },
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
  placeholder?: string
  required?: boolean
}

export function PhoneInput({
  value,
  onChange,
  countryCode = "+62",
  onCountryCodeChange,
  placeholder = "81234567890",
  required = false
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find(c => c.code === countryCode) || countries[0]
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country)
    if (onCountryCodeChange) {
      onCountryCodeChange(country.code)
    }
    setIsOpen(false)
  }

  // Extract phone number without country code
  const phoneNumber = value.startsWith(selectedCountry.code)
    ? value.slice(selectedCountry.code.length).trim()
    : value

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "") // Only numbers
    onChange(inputValue ? `${selectedCountry.code} ${inputValue}` : "")
  }

  return (
    <div className="flex items-stretch gap-0 rounded-md border border-border bg-background shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-ring">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center shrink-0",
              "bg-muted/50 border-r border-border",
              "hover:bg-muted hover:text-foreground",
              "focus:outline-none focus:bg-muted",
              "rounded-l-md rounded-r-none",
              "px-3 py-2.5 min-w-[60px]",
              "transition-all duration-200",
              "active:scale-[0.98]"
            )}
          >
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-base leading-none overflow-hidden bg-background border border-border/50 shadow-sm">
                {selectedCountry.flag}
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200 text-muted-foreground",
                isOpen && "rotate-180"
              )} />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-72 max-h-[320px] overflow-y-auto p-1.5"
          align="start"
          sideOffset={4}
        >
          <div className="px-2 py-1.5 mb-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Select Country
            </p>
          </div>
          <div className="space-y-0.5">
            {countries.map((country) => (
              <DropdownMenuItem
                key={`${country.code}-${country.name}`}
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  "cursor-pointer w-full",
                  "flex items-center gap-3",
                  "px-3 py-2.5 rounded-md",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors duration-150",
                  selectedCountry.code === country.code && "bg-accent/50"
                )}
              >
                <span className="text-xl leading-none flex-shrink-0">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {country.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                      {country.code}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex-1 relative">
        <Input
          type="tel"
          id="phone-input"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          className={cn(
            "w-full h-full",
            "bg-transparent border-0",
            "text-foreground text-sm",
            "rounded-r-md rounded-l-none",
            "focus:outline-none focus:ring-0 focus-visible:ring-0",
            "px-3 py-2.5",
            "placeholder:text-muted-foreground/60"
          )}
        />
      </div>
    </div>
  )
}

