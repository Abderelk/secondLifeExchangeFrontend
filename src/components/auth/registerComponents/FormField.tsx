import { TextField } from '@mui/material';

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  loading: boolean;
  inputStyles: object;
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
}

export const FormField = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  loading,
  inputStyles,
  autoComplete,
  multiline = false,
  rows,
}: FormFieldProps) => (
  <div style={{ marginBottom: '16px' }}>
    <label
      style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '6px',
      }}
    >
      {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
    <TextField
      fullWidth
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      variant="outlined"
      disabled={loading}
      autoComplete={autoComplete}
      placeholder={placeholder}
      size="small"
      multiline={multiline}
      rows={rows}
      sx={multiline ? {
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          backgroundColor: '#F3F4F6',
          '& fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: '2px solid #22C55E' },
        },
        '& .MuiInputBase-input': {
          fontSize: '14px',
          '&::placeholder': { color: '#9CA3AF', opacity: 1 },
        },
      } : inputStyles}
    />
  </div>
);

export default FormField;
