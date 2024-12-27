"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CameraIcon, Image } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Camera } from "./Camera";

interface ImageInputProps {
  label?: string;
  name: string;
  form: UseFormReturn<FieldValues>;
  className?: string;
  disabled?: boolean;
}

export default function ImageInput({
  label,
  name,
  form,
  className,
  disabled,
}: ImageInputProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (file: File, field: ControllerRenderProps<FieldValues, any>) => {
      if (file) {
        field.onChange(file);
      }
    },
    []
  );

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="h-min text-center">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div
                    className={`flex px-2 border-gray-200 border-[.5px] bg-[#f8f8ff59] py-[6px] flex-col items-center h-48 w-48 rounded-full justify-center hover:bg-[ghostwhite] cursor-pointer transition-all bg-cover ${className}`}
                    style={{
                      backgroundImage: `linear-gradient(45deg, #f8f8ff59, #f8f8ff59), url(${
                        field?.value instanceof File
                          ? URL.createObjectURL(field?.value)
                          : field?.value
                      })`,
                    }}
                  >
                    <CameraIcon className="text-gray-700 h-8 w-8" />
                    <p>Click to Upload</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Choose an option</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4 w-full">
                    <div className="flex justify-around flex-col  w-full gap-4">
                      <Button
                        className="w-[webkit-fill-available]"
                        onClick={() => hiddenInputRef.current?.click()}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Choose From Gallery
                      </Button>
                      <Camera
                        onCapture={(file: File) => {
                          console.log(
                            `🚀 ~ file: InputImage.tsx:91 ~ file:`,
                            file
                          );
                          handleFileChange(file, field);
                          setIsDialogOpen(false);
                        }}
                      />
                    </div>
                    {field?.value && (
                      <div className="flex flex-col items-center space-y-4">
                        <img
                          src={
                            field?.value instanceof File
                              ? URL.createObjectURL(field?.value)
                              : field?.value
                          }
                          alt="Current"
                          className="w-48 h-48 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <input
                type="file"
                accept="image/png,image/gif,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileChange(file, field);
                    setIsDialogOpen(false);
                  }
                }}
                className="hidden"
                ref={hiddenInputRef}
              />
            </>
          </FormControl>
          <p className="text-red-500">Face should be clearly visible</p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
