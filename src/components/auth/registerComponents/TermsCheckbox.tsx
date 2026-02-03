import { FormControlLabel, Checkbox } from '@mui/material';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  loading: boolean;
}

export const TermsCheckbox = ({ checked, onChange, loading }: TermsCheckboxProps) => (
  <div style={{ marginBottom: '24px' }}>
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={loading}
          sx={{
            color: '#D1D5DB',
            '&.Mui-checked': {
              color: '#22C55E',
            },
          }}
        />
      }
      label={
        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          J'accepte les{' '}
          <a href="/terms" style={{ color: '#22C55E', textDecoration: 'underline' }}>
            conditions générales d'utilisation
          </a>
          {' '}et la{' '}
          <a href="/privacy" style={{ color: '#22C55E', textDecoration: 'underline' }}>
            politique de confidentialité
          </a>
          {' '}<span style={{ color: '#EF4444' }}>*</span>
        </span>
      }
    />
  </div>
);

export default TermsCheckbox;
