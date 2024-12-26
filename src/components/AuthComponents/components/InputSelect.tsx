"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { InputFieldProps } from "../InputField";

const InputSelect: React.FC<InputFieldProps> = (props) => {
  const { label, name, placeholder, form, className, disabled, Icon } = props;

  // State to control the visibility of the Select dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Reference to track the Select element
  const selectRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Close the dropdown when scrolling
      if (isOpen) {
        setIsOpen(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem
          className={`sm:max-w-[300px] sm:min-w-[250px] min-w-[70vw] ${className}`}
          ref={selectRef}
        >
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              setIsOpen(false); // Close the dropdown after selection
            }}
            value={field.value}
            open={isOpen} // Control the dropdown visibility
            onOpenChange={setIsOpen} // Update isOpen state when dropdown is opened/closed
          >
            <FormControl>
              <SelectTrigger className="flex items-center !min-h-[44px]">
                <div className="flex gap-4 items-center truncate">
                  {Icon && <Icon size={20} />}
                  <SelectValue className="truncate" placeholder={placeholder} />
                </div>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options?.map((item) => (
                <SelectItem
                  key={item?.value}
                  value={item.value!}
                  className="truncate"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputSelect;
