import { InputFieldProps } from "@/components/AuthComponents/InputField";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useCallback, useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import PlacesAutocomplete, {
  geocodeByPlaceId,
  Suggestion,
} from "react-places-autocomplete";
import Select from "react-select";

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  inputProps: InputFieldProps;
};
interface PlaceOption {
  description: string;
  placeId: string;
}

const AddressInput = ({ field, inputProps }: Props) => {
  const { label, placeholder, className } = inputProps;
  const handleSelect = async (
    option: PlaceOption,
    onChange: (value: any) => void
  ) => {
    if (!option?.placeId) {
      if (option?.placeId === "") {
      } else {
        onChange({
          address: undefined,
          position: {
            lat: 0,
            lng: 0,
          },
        });
      }
    } else {
      const response = await geocodeByPlaceId(option.placeId);

      onChange({
        address: response[0]?.formatted_address,
        position: response[0]?.geometry?.location?.toJSON(),
      });
    }
  };

  const [state, setState] = useState<Suggestion[]>([
    field?.value?.address && {
      id: "initial-id",
      active: false,
      index: 0,
      formattedSuggestion: field?.value?.address ?? "",
      description: field?.value?.address ?? "",
      placeId: "",
      matchedSubstrings: [], // Provide appropriate default value
      terms: [], // Provide appropriate default value
      types: [], // Provide appropriate default value
      // other properties with default values...
    },
  ]);
  const [value, setValue] = useState<string>("");
  const handleFieldChange1 = field.onChange;
  const handleFieldChange = useCallback(
    (newValue: any) => {
      handleFieldChange1(newValue);

      // react-hooks/exhaustive-deps
    },
    [handleFieldChange1] // Only recreate if 'field' changes
  );

  useEffect(() => {
    if (state.length === 0) {
      handleFieldChange({
        address: undefined,
        position: {
          lat: 0,
          lng: 0,
        },
      });
    } else {
      handleSelect(state[0], handleFieldChange);
    }
  }, [state, handleFieldChange]);
  return (
    <FormItem className={`max-w-[300px] min-w-[300px] ${className}`}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <PlacesAutocomplete
          value={value}
          onChange={(value) => {
            setValue(value);
          }}
        >
          {({ getInputProps, suggestions, loading }) => {
            return (
              <Select
                isLoading={loading}
                placeholder={placeholder}
                components={{
                  IndicatorSeparator: () => null,
                }}
                value={state[0]}
                escapeClearsValue={false}
                options={suggestions}
                getOptionLabel={(option: Suggestion) => option.description}
                getOptionValue={(option: Suggestion) => option.placeId}
                onInputChange={(value) => {
                  getInputProps().onChange({
                    target: { value },
                  });
                }}
                filterOption={() => true}
                onChange={(value) => {
                  if (value) {
                    setState([value]);
                  } else {
                    setState([]);
                  }
                }}
                isClearable={true}
                isSearchable={true}
              />
            ) as any;
          }}
        </PlacesAutocomplete>
      </FormControl>

      <FormMessage />
    </FormItem>
  );
};

export default React.memo(AddressInput);
