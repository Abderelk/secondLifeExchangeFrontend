import { TextField, InputAdornment, IconButton, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface PasswordInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleShow: () => void;
  placeholder: string;
  loading: boolean;
  inputStyles: object;
  error?: string;
}

export const PasswordInput = ({
  name,
  label,
  value,
  onChange,
  showPassword,
  onToggleShow,
  placeholder,
  loading,
  inputStyles,
  error,
}: PasswordInputProps) => (
  <div style={{ marginBottom: error ? '8px' : '16px' }}>
    <label
      style={{
        display: 'block',
        fontSize: '14px',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '6px',
      }}
    >
      {label} <span style={{ color: '#EF4444' }}>*</span>
    </label>
    <TextField
      fullWidth
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required
      variant="outlined"
      disabled={loading}
      autoComplete="new-password"
      placeholder={placeholder}
      size="small"
      sx={inputStyles}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onToggleShow}
                edge="end"
                disabled={loading}
                size="small"
              >
                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
    {error && (
      <Typography variant="caption" sx={{ color: '#EF4444', mt: 0.5, display: 'block' }}>
        {error}
      </Typography>
    )}
  </div>
);

export default PasswordInput;
