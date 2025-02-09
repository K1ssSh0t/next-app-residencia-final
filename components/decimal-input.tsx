"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DecimalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    precision?: number
    scale?: number
    error?: string
    defaultValue?: number
}

export default function DecimalInput({
    label,
    precision = 10,
    scale = 2,
    error,
    defaultValue = 0,
    value,
    onChange,
    ...props
}: DecimalInputProps) {
    // Use state to manage the input value
    const [inputValue, setInputValue] = React.useState(defaultValue || "");

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value

        // Allow empty input
        if (!input) {
            setInputValue("")
            onChange?.(e)
            return
        }

        // Only allow numbers and one decimal point
        const regex = new RegExp(`^\\d{0,${precision - scale}}(\\.\\d{0,${scale}})?$`)
        if (regex.test(input)) {
            setInputValue(input); // Update the state value
            onChange?.(e)
        }
    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            {label && <Label htmlFor="decimal">{label}</Label>}
            <Input
                type="text"
                inputMode="decimal"
                pattern={`^\\d{0,${precision - scale}}(\\.\\d{0,${scale}})?$`}
                value={inputValue} // Use the state value
                onChange={handleChange}
                {...props}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    )
}

