import { FormField } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { geocodeByPlaceId } from "react-places-autocomplete";
import { InputFieldProps } from "../../InputField";
import AddressInput from "./components/mini_form";

interface PlaceOption {
  description: string;
  placeId: string;
}

const InputAddress: React.FC<InputFieldProps> = (props) => {
  const { label, name, placeholder, form, className } = props;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleSelect = async (
    option: PlaceOption,
    onChange: (value: any) => void
  ) => {
    if (!option?.placeId) {
      if (option.placeId === "") {
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

  useEffect(() => {
    let script: HTMLScriptElement | undefined;

    if (!window.google) {
      script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [apiKey]);

  if (!scriptLoaded) {
    return <p>Loading Script...</p>; // or return a loading spinner
  }

  return (
    <FormField
      disabled={props.disabled}
      control={form.control}
      name={name}
      render={({ field }) => {
        return <AddressInput field={field} inputProps={props} />;
      }}
    />
  );
};

export default React.memo(InputAddress);
