import { LinearProgress } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface PasswordCriteriaItemProps {
  met: boolean;
  text: string;
}

export const PasswordCriteriaItem = ({ met, text }: PasswordCriteriaItemProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
    {met ? (
      <Check sx={{ fontSize: 14, color: '#22C55E' }} />
    ) : (
      <Close sx={{ fontSize: 14, color: '#D1D5DB' }} />
    )}
    <span style={{ fontSize: '12px', color: met ? '#22C55E' : '#9CA3AF' }}>
      {text}
    </span>
  </div>
);

export const passwordCriteria = {
  minLength: (password: string) => password.length >= 12,
  hasUppercase: (password: string) => /[A-Z]/.test(password),
  hasLowercase: (password: string) => /[a-z]/.test(password),
  hasNumber: (password: string) => /[0-9]/.test(password),
  hasSpecialChar: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
};

export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (passwordCriteria.minLength(password)) strength += 20;
  if (passwordCriteria.hasUppercase(password)) strength += 20;
  if (passwordCriteria.hasLowercase(password)) strength += 20;
  if (passwordCriteria.hasNumber(password)) strength += 20;
  if (passwordCriteria.hasSpecialChar(password)) strength += 20;
  return strength;
};

export const isValidPassword = (password: string): boolean => {
  return (
    passwordCriteria.minLength(password) &&
    passwordCriteria.hasUppercase(password) &&
    passwordCriteria.hasSpecialChar(password)
  );
};

const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 20) return '#EF4444';
  if (strength <= 40) return '#F97316';
  if (strength <= 60) return '#EAB308';
  if (strength <= 80) return '#84CC16';
  return '#22C55E';
};

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: '#E5E7EB',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getPasswordStrengthColor(strength),
            borderRadius: 3,
          },
        }}
      />
      <div style={{ marginTop: '8px' }}>
        <PasswordCriteriaItem
          met={passwordCriteria.minLength(password)}
          text="12 caractères minimum"
        />
        <PasswordCriteriaItem
          met={passwordCriteria.hasUppercase(password)}
          text="Une lettre majuscule"
        />
        <PasswordCriteriaItem
          met={passwordCriteria.hasLowercase(password)}
          text="Une lettre minuscule"
        />
        <PasswordCriteriaItem
          met={passwordCriteria.hasNumber(password)}
          text="Un chiffre"
        />
        <PasswordCriteriaItem
          met={passwordCriteria.hasSpecialChar(password)}
          text="Un caractère spécial (!@#$%...)"
        />
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
