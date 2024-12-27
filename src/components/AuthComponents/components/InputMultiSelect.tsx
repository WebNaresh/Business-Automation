"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as React from "react";
import CreatableSelect from "react-select/creatable";
import { InputFieldProps } from "../InputField";

const InputMultiSelect: React.FC<InputFieldProps> = (props) => {
  const { label, name, form, options, className, placeholder, disabled, Icon } =
    props;

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={`max-w-[250px] min-w-[250px] ${className}`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 text-gray-500"
                  size={20}
                />
              )}
              <CreatableSelect
                className="w-full z-10"
                defaultValue={field.value}
                placeholder={placeholder}
                isMulti
                name={name}
                options={options}
                onChange={(value) => {
                  field.onChange(value);
                }}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    ...(Icon ? { paddingLeft: "2rem" } : {}),
                  }),
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputMultiSelect;
