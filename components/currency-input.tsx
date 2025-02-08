import React from 'react';
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
    id: string;
    name: string;
    defaultValue?: number;
    onChange: (value: number | undefined) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ id, name, defaultValue = 0, onChange }) => {
    const [value, setValue] = React.useState<string>(defaultValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }));

    React.useEffect(() => {
        setValue(defaultValue.toLocaleString('es-MX', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }));
    }, [defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Remove all non-numeric characters except the decimal separator
        const cleanedValue = inputValue.replace(/[^0-9.]/g, '');

        // Allow only one decimal separator
        const parts = cleanedValue.split('.');
        if (parts.length > 2) {
            return;
        }

        setValue(cleanedValue);

        // Parse the cleaned value to a number
        const parsedValue = parseFloat(cleanedValue);
        if (!isNaN(parsedValue)) {
            onChange(parsedValue);
        } else {
            onChange(undefined);
        }
    };

    const handleBlur = () => {
        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setValue(parsedValue.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }));
        } else {
            setValue('0.00');
            onChange(0);
        }
    };

    return (
        <Input
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default CurrencyInput;
