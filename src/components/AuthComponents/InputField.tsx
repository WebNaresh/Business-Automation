"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React, { FC } from "react";
import InputAddress from "./components/InputAddress/input";
import InputCheckbox from "./components/InputCheckBox";
import ImageInput from "./components/InputImage";
import InputMultiSelect from "./components/InputMultiSelect";
import InputOTPController from "./components/InputOTP";
import InputRating from "./components/InputRating";
import InputSelect from "./components/InputSelect";
import InputTextArea from "./components/InputTextArea";
import MultiImageInput from "./components/multiImageInput";

export interface BaseInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  type:
    | "text"
    | "password"
    | "email"
    | "OTP"
    | "avatar"
    | "number"
    | "file"
    | "select"
    | "multiSelect"
    | "multiSelect_images"
    | "rating"
    | "places_autocomplete"
    | "text-area"
    | "date"
    | "checkbox";
  form: any;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
}

export interface InputFieldProps extends BaseInputProps {
  options?: { value: string | null; label: string }[];
  async_function?: (
    input: string
  ) => Promise<{ value: string; label: string }[]>;
  Icon?: LucideIcon;
  iconClassName?: string;
}

type SelectOption = {
  value: string;
  label: string;
};

export interface SelectProp extends BaseInputProps {
  options: SelectOption[];
}

const InputField: FC<InputFieldProps> = (props) => {
  const {
    label,
    name,
    placeholder,
    type,
    form,
    className,
    disabled = false,
    autoComplete = "off",
    Icon,
    iconClassName,
  } = props;

  // Check if the field is required based on the validation schema
  const isRequired = form?.schema?.shape?.[name]?._def?.checks?.some(
    (check: any) => check.kind === "min" || check.kind === "required"
  );

  if (type === "OTP") {
    return <InputOTPController {...props} />;
  }
  if (type === "avatar") {
    return <ImageInput {...props} />;
  }
  if (type === "select" && props?.options) {
    return <InputSelect {...props} />;
  }
  if (type === "multiSelect" && props?.options) {
    return <InputMultiSelect {...props} />;
  }
  if (type === "multiSelect_images") {
    return <MultiImageInput {...props} />;
  }
  if (type === "rating") {
    return <InputRating {...props} />;
  }
  if (type === "places_autocomplete") {
    return <InputAddress {...props} />;
  }
  if (type === "text-area") {
    return <InputTextArea {...props} />;
  }
  if (type === "checkbox") {
    return <InputCheckbox {...props} />;
  }

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={`sm:max-w-[300px] sm:min-w-[250px] min-w-[70vw] ${className}`}
        >
          <FormLabel
            className={cn(
              isRequired &&
                "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon
                  size={10}
                  className={cn(
                    "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                    iconClassName
                  )}
                />
              )}

              <Input
                autoComplete={autoComplete}
                size={6}
                onWheel={(e) => e.currentTarget.blur()}
                className={cn("dark:focus:ring-white h-11", Icon && "pl-10")}
                type={type}
                placeholder={placeholder}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default React.memo(InputField);
