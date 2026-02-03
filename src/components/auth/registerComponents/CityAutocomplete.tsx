import { useState, useEffect, useCallback, type SyntheticEvent } from 'react';
import { Autocomplete, TextField, CircularProgress, Box } from '@mui/material';
import { useDebounce } from '../../../hooks';

interface CitySuggestion {
  city: string;
  postalCode: string;
  label: string;
}

interface AddressFeature {
  properties: {
    city?: string;
    name?: string;
    postcode: string;
  };
}

interface AddressApiResponse {
  features: AddressFeature[];
}

interface CityAutocompleteProps {
  cityInputValue: string;
  onCityInputChange: (value: string) => void;
  onCitySelect: (city: string, postalCode: string) => void;
  loading: boolean;
  inputStyles: object;
}

export const CityAutocomplete = ({
  cityInputValue,
  onCityInputChange,
  onCitySelect,
  loading,
  inputStyles,
}: CityAutocompleteProps) => {
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);

  const debouncedCityInput = useDebounce(cityInputValue, 300);

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=10`
      );
      const data: AddressApiResponse = await response.json();

      const suggestions: CitySuggestion[] = data.features.map((feature: AddressFeature) => ({
        city: feature.properties.city || feature.properties.name || '',
        postalCode: feature.properties.postcode,
        label: `${feature.properties.city || feature.properties.name} (${feature.properties.postcode})`,
      }));

      const uniqueSuggestions = suggestions.filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.label === suggestion.label)
      );

      setCitySuggestions(uniqueSuggestions);
    } catch (err) {
      console.error('Erreur lors de la recherche de villes:', err);
      setCitySuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    searchCities(debouncedCityInput);
  }, [debouncedCityInput, searchCities]);

  const handleCitySelect = (
    _event: SyntheticEvent<Element, Event>,
    value: CitySuggestion | string | null
  ) => {
    if (value && typeof value !== 'string') {
      setSelectedCity(value);
      onCitySelect(value.city, value.postalCode);
      onCityInputChange(value.city);
    } else if (typeof value === 'string') {
      onCitySelect(value, '');
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={citySuggestions}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.city
      }
      value={selectedCity}
      loading={loadingSuggestions}
      inputValue={cityInputValue}
      onInputChange={(_event, newValue) => {
        onCityInputChange(newValue);
        if (!selectedCity || selectedCity.city !== newValue) {
          onCitySelect(newValue, '');
        }
      }}
      onChange={handleCitySelect}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={key} {...otherProps}>
            <div>
              <div style={{ fontWeight: 500 }}>{option.city}</div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>{option.postalCode}</div>
            </div>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Rechercher..."
          size="small"
          sx={inputStyles}
          disabled={loading}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingSuggestions ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default CityAutocomplete;
