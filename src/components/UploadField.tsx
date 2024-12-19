import Image from 'next/image';
import React from 'react';
import { FieldError } from 'react-hook-form';

type UploadFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  error?: FieldError;
};

const UploadField = ({
  label,
  type = 'text',
  register,
  name,
  error,
}: UploadFieldProps) => {
  return (
    <div className='flex flex-col gap-2 w-full md:w-1/4 justify-center'>
      <label
        htmlFor={name}
        className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'
      >
        <Image src={'/upload.png'} alt='upload' width={28} height={28} />
        <span>{label}:</span>
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full hidden'
      />
      {error?.message && (
        <p className='text-red-400 text-xs'>{error?.message.toString()}</p>
      )}
    </div>
  );
};

export default UploadField;
