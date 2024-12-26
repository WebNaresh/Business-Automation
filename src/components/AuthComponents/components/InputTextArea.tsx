import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InputFieldProps } from "../InputField";

type Props = {};

const InputTextArea = (props: InputFieldProps) => {
  const {
    label,
    name,
    form,
    placeholder,
    className,
    disabled,
    Icon,
    iconClassName,
  } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => {
        return (
          <FormItem className={`max-w-[250px] min-w-[250px] ${className}`}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                {Icon && (
                  <Icon
                    size={10}
                    className={cn(
                      "absolute left-3 top-5 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                      iconClassName
                    )}
                  />
                )}

                <Textarea
                  className={cn("dark:focus:ring-white h-11", Icon && "pl-10")}
                  placeholder={placeholder}
                  {...field}
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

export default InputTextArea;
