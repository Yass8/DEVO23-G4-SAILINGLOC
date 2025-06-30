
export const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    minHeight: 'unset',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  indicatorsContainer: (base) => ({
    ...base,
    color: '#F5F1EB',
    paddingRight: 4,
  }),
  valueContainer: (base) => ({ ...base, paddingLeft: 0 }),
  placeholder: (base) => ({ ...base, color: '#F5F1EB' }),
  singleValue: (base) => ({ ...base, color: '#F5F1EB' }),
  input: (base) => ({ ...base, color: '#F5F1EB' }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#4B6A88',
    color: '#F5F1EB',
    zIndex: 50,
    opacity: 1,
    position: 'relative', // ou 'absolute' selon ton layout
    }),
    menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
    }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#AD7C59' : 'transparent',
    color: '#F5F1EB',
  }),
};

export const customSelectTheme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#AD7C59',
    primary: '#F5F1EB',
    neutral0: '#4B6A88',
    neutral20: '#F5F1EB',
    neutral80: '#F5F1EB',
  },
});
