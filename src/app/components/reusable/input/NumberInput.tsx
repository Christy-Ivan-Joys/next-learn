"use client";

import BaseInput, { BaseInputProps } from "./BaseInput";

export default function NumberInput(props: BaseInputProps) {
  return <BaseInput {...props} type="number" />;
}
