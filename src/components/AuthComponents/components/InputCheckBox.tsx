"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FC } from "react";
import { InputFieldProps } from "../InputField";

const InputCheckbox: FC<InputFieldProps> = (props) => {
  const { label, name, form, className, disabled } = props;

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={`max-w-[300px] min-w-[300px] ${className} flex flex-col gap-4 `}
        >
          <div className="flex items-center gap-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className="truncate flex justify-start !mt-0 w-full text-left">
              {label}
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputCheckbox;
