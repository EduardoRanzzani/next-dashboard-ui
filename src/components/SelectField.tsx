import React from 'react';
import { FieldError } from 'react-hook-form';

type SelectFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
  options?: string[];
};

const SelectField = ({
  label,
  type = 'text',
  register,
  name,
  defaultValue,
  error,
  selectProps,
  options,
}: SelectFieldProps) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-1/4'>
      <label htmlFor='username' className='text-xs text-gray-500'>
        {label}:
      </label>
      <select
        type={type}
        {...register(name)}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
        {...selectProps}
        defaultValue={defaultValue}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error?.message && (
        <p className='text-red-400 text-xs'>{error?.message.toString()}</p>
      )}
    </div>
  );
};

export default SelectField;
