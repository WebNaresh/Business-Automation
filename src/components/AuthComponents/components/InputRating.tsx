import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { FaStar } from "react-icons/fa"; // Import a star icon from react-icons
import { InputFieldProps } from "../InputField";

const InputRating = ({
  form,
  label,
  name,
  className,
  disabled,
}: InputFieldProps) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className={`max-w-[300px] min-w-[300px] ${className}`}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex space-x-1 justify-around">
              {Array.from({ length: 5 }, (_, index) => {
                const starValue = index + 1;
                return (
                  <Button
                    key={index}
                    type="button"
                    variant="link"
                    onClick={() => field.onChange(starValue)}
                    onMouseEnter={() => setHover(starValue)}
                    onMouseLeave={() => setHover(null)}
                    className="p-1"
                  >
                    <FaStar
                      className={`text-2xl hover:scale-125 transition-all ${
                        starValue <= (hover ?? field.value)
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputRating;
