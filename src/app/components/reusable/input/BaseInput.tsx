"use client";

import { TextField } from "@mui/material";

export interface BaseInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    required?:boolean;
    startAdornment?: React.ReactNode;
  }

export default function BaseInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  startAdornment,
}: BaseInputProps) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      placeholder={placeholder}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      required={required}
      InputProps={{
        startAdornment,
        style: {
          borderRadius: 12,
          height: 50,
          fontSize: "1rem",
        },
      }}
    />
  );
}
