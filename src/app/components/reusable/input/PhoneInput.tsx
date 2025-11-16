"use client";

import { PhoneInput as IntlPhone } from "react-international-phone";
import "react-international-phone/style.css";

export interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInput({
  label = "Phone number",
  value,
  onChange
}: PhoneInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-gray-700 text-sm">{label}</label>
      <IntlPhone
        defaultCountry="in"
        value={value}
        onChange={onChange}  
        className="my-phone-input"
        inputClassName="my-phone-input"
        countrySelectorStyleProps={{
          buttonClassName: "flex items-center gap-2 px-5 py-1"
        }}
      />
    </div>
  );
}
