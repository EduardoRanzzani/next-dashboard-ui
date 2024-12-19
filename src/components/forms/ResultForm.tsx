'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import SelectField from '../SelectField';
import UploadField from '../UploadField';

const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long!' })
    .max(20, { message: 'Username must be at most 20 characters long!' }),
  email: z.string().email({ message: 'Invalid email address!' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long!' }),
  firstname: z.string().min(1, { message: 'Firstname is required!' }),
  lastname: z.string().min(1, { message: 'Lastname is required!' }),
  phone: z.string().min(8, { message: 'Phone is required!' }),
  address: z.string().min(1, { message: 'Address is required!' }),
  bloodType: z.string().min(1, { message: 'Blood Type is required!' }),
  birthday: z.date({ message: 'Birthday is required!' }),
  sex: z.enum(['Male', 'Female'], { message: 'Sex is required!' }),
  img: z.instanceof(File, { message: 'Image is required!' }),
});

type Inputs = z.infer<typeof schema>;

const ResultForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className='flex flex-col gap-8' onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>Create a new Result</h1>
      <span className='text-xs text-gray-400 font-medium'>
        Authentication Information
      </span>

      <div className='flex justify-between flex-wrap gap-8'>
        <InputField
          label='Username'
          name='username'
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label='Email'
          name='email'
          type='email'
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label='Password'
          name='password'
          type='password'
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>

      <span className='text-xs text-gray-400 font-medium'>
        Personal Information
      </span>

      <div className='flex justify-between flex-wrap gap-8'>
        <InputField
          label='Firstname'
          name='firstname'
          defaultValue={data?.firstname}
          register={register}
          error={errors?.firstname}
        />

        <InputField
          label='Lastname'
          name='lastname'
          defaultValue={data?.lastname}
          register={register}
          error={errors?.lastname}
        />

        <InputField
          label='Phone'
          name='phone'
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />

        <InputField
          label='Address'
          name='address'
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />

        <InputField
          label='Blood Type'
          name='bloodType'
          defaultValue={data?.bloodType}
          register={register}
          error={errors?.bloodType}
        />

        <InputField
          label='Date of Birth'
          name='birthday'
          type='date'
          defaultValue={data?.birthday}
          register={register}
          error={errors?.birthday}
        />

        <SelectField
          label='Sex'
          name='sex'
          defaultValue={data?.sex}
          register={register}
          error={errors?.sex}
          options={['Select...', 'Male', 'Female']}
        />

        <UploadField
          label='Upload an Image'
          name='img'
          type='file'
          register={register}
          error={errors?.img}
        />
      </div>

      <button className='bg-blue-400 text-white p-2 rounded-md'>
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ResultForm;
