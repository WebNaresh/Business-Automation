"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { BiX } from "react-icons/bi";
import { BaseInputProps } from "../InputField";

const MultiImageInput = ({ label, name, form }: BaseInputProps) => {
  const imageRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="h-min w-full justify-between">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex justify-between items-center border border-gray-300 rounded-sm p-2 cursor-pointer">
                <div
                  className="flex w-full"
                  onClick={() => imageRef.current?.click()}
                >
                  {field.value !== undefined && field.value.length !== 0 ? (
                    field.value.map((item: File, index: number) => (
                      <Avatar
                        key={index}
                        className=" -mx-1 border hover:scale-110 cursor-pointer transition-all ease-in-out h-[20px] w-[20px] "
                      >
                        <AvatarImage src={URL.createObjectURL(item)} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    ))
                  ) : (
                    <p className="text-slate-600">Click to Choose Image</p>
                  )}
                </div>
                {field.value !== undefined && field.value.length !== 0 && (
                  <Button
                    type="button"
                    size={"icon"}
                    onClick={() => field.onChange([])}
                    className="rounded-full h-[20px] w-[20px] flex items-center justify-center"
                  >
                    <BiX className="text-xl" />
                  </Button>
                )}
                <input
                  ref={imageRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      field.onChange(Array.from(e.target.files));
                    }
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default MultiImageInput;
