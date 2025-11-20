"use client";

import { clsx } from "clsx";
import { Description, FieldError, Label, SharedFieldProps } from "primitives";
import React, { useEffect, useRef } from "react";
import {
  Input as RACInput,
  TextField as RACTextField,
  type InputProps as RACInputProps,
  type TextFieldProps as RACTextFieldProps,
} from "react-aria-components";
import IMask from "imask";
import "./input.css";

export type InputFieldProps = SharedFieldProps & RACTextFieldProps;
export function InputField({
  className,
  placeholder,
  label,
  description,
  errorMessage,
  ...props
}: InputFieldProps) {
  const classNames = clsx(className, "field");
  return (
    <RACTextField className={classNames} {...props}>
      {label && <Label>{label}</Label>}
      <Input placeholder={placeholder} />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </RACTextField>
  );
}

export type InputProps = RACInputProps;
export const Input = React.forwardRef(function Input(
  { className, type, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const classNames = clsx(className, "input");
  const internalRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<ReturnType<typeof IMask> | null>(null);

  // Combine refs
  useEffect(() => {
    if (typeof ref === "function") {
      ref(internalRef.current);
    } else if (ref) {
      ref.current = internalRef.current;
    }
  }, [ref]);

  // Apply phone masking for tel inputs
  useEffect(() => {
    if (type === "tel" && internalRef.current) {
      maskRef.current = IMask(internalRef.current, {
        mask: "(000) 000-0000",
      });

      return () => {
        maskRef.current?.destroy();
      };
    }
  }, [type]);

  return <RACInput className={classNames} ref={internalRef} type={type} {...props} />;
});
