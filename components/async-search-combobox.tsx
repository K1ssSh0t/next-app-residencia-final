"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface GenericType {
    [key: string]: any
}

export function AsyncSearchCombobox<Type extends GenericType>({
    onSearch,
    onDefaultValue,
    name,
    defaultValue,
    valueField,
    searchPlaceholder = "Search...",
    selectPlaceholder = "Select...",
    emptyText = "No results found.",
    keywordFields,
    template,
    onChange,
    minSearchLength = 3,
}: {
    onSearch: (query: string) => Promise<Type[]>
    onDefaultValue?: (value: string) => Promise<Type | null>
    name: string
    defaultValue?: string | null
    valueField: string
    searchPlaceholder?: string
    selectPlaceholder?: string
    emptyText?: string
    keywordFields: string[]
    template: (item: Type) => React.ReactNode
    onChange?: (value: string, item: Type | null) => void
    minSearchLength?: number
}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<string | null | undefined>(defaultValue)
    const [items, setItems] = React.useState<Type[]>([])
    const [loading, setLoading] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedItem, setSelectedItem] = React.useState<Type | null>(null)

    // Manejar la búsqueda cuando cambia el término de búsqueda
    React.useEffect(() => {
        const search = async () => {
            if (searchTerm.length >= minSearchLength) {
                setLoading(true)
                try {
                    const results = await onSearch(searchTerm)
                    setItems(results || [])
                } catch (error) {
                    console.error("Search error:", error)
                    setItems([])
                } finally {
                    setLoading(false)
                }
            } else {
                setItems([])
            }
        }

        const timeoutId = setTimeout(search, 300) // Debounce de 300ms
        return () => clearTimeout(timeoutId)
    }, [searchTerm, minSearchLength, onSearch])

    // Efecto para cargar los datos iniciales cuando hay un defaultValue
    React.useEffect(() => {
        const loadInitialValue = async () => {
            if (defaultValue && onDefaultValue) {
                setLoading(true)
                try {
                    const result = await onDefaultValue(defaultValue)
                    if (result) {
                        setSelectedItem(result[0])
                    }
                } catch (error) {
                    console.error("Initial load error:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        loadInitialValue()
    }, [])

    const handleValueChange = (newValue: string, item: Type | null) => {
        setValue(newValue)
        setSelectedItem(item)
        if (onChange) {
            onChange(newValue, item)
        }
    }

    let label = value ? (selectedItem ? template(selectedItem) : selectPlaceholder) : selectPlaceholder
    // if (value) {
    //     const item = selectedItem;
    //     if (item) {
    //         label = template(item);
    //     }
    // }
    console.log(label)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <input type="hidden" name={name} value={value ?? ""} />
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {label ?? selectPlaceholder}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command
                    filter={(value, search, keywords) => {
                        const extendValue = value + " " + keywords?.join(" ")
                        if (extendValue.toLowerCase().includes(search.toLowerCase())) {
                            return 1
                        }
                        return 0
                    }}
                >
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        className="h-9"
                    />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                {items.length === 0 && searchTerm.length >= minSearchLength ? (
                                    <CommandEmpty>{emptyText}</CommandEmpty>
                                ) : (
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item[valueField]}
                                                value={item[valueField]}
                                                keywords={keywordFields.map((field) => item[field])}
                                                onSelect={(currentValue) => {
                                                    const newValue = currentValue === value ? "" : currentValue
                                                    handleValueChange(newValue, newValue ? item : null)
                                                    setOpen(false)
                                                }}
                                            >
                                                {template(item)}
                                                <CheckIcon
                                                    className={cn("ml-auto h-4 w-4", value === item[valueField] ? "opacity-100" : "opacity-0")}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

