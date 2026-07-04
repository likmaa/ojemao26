import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  infoText?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  options = [],
  defaultValue,
  infoText,
}: FormFieldProps) {
  const commonInputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-inter)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    outline: 'none',
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            id={name}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue}
            rows={4}
            style={commonInputStyles}
            className="form-input-focus"
          />
        );
      case 'select':
        return (
          <select
            name={name}
            id={name}
            required={required}
            defaultValue={defaultValue || ''}
            style={{ ...commonInputStyles, appearance: 'none', WebkitAppearance: 'none' } as React.CSSProperties}
            className="form-input-focus"
          >
            <option value="" disabled style={{ background: '#0A1628', color: '#64748B' }}>
              {placeholder || 'Sélectionnez une option'}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#0A1628', color: '#FFFFFF' }}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div style={styles.radioGroup}>
            {options.map((opt) => (
              <label key={opt.value} style={styles.radioLabel}>
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  required={required}
                  defaultChecked={defaultValue === opt.value}
                  style={styles.radioInput}
                />
                <span style={styles.radioText}>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            id={name}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue}
            style={commonInputStyles}
            className="form-input-focus"
          />
        );
    }
  };

  return (
    <div style={styles.fieldContainer}>
      <label htmlFor={name} style={styles.label}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      {renderField()}
      {infoText && <span style={styles.info}>{infoText}</span>}
    </div>
  );
}

const styles = {
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    width: '100%',
    marginBottom: '1.25rem',
  },
  label: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'left' as const,
  },
  required: {
    color: 'var(--accent)',
    marginLeft: '2px',
  },
  info: {
    fontSize: '0.75rem',
    color: '#94A3B8',
    marginTop: '0.25rem',
    textAlign: 'left' as const,
  },
  radioGroup: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '0.25rem',
    flexWrap: 'wrap' as const,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
  },
  radioInput: {
    cursor: 'pointer',
    accentColor: 'var(--accent)',
    width: '18px',
    height: '18px',
  },
  radioText: {
    fontSize: '0.9rem',
    color: '#E2E8F0',
  },
};
