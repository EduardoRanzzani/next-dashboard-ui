'use client';

import { createParent, updateParent } from '@/lib/actions';
import { parentSchema, ParentSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { toast } from 'react-toastify';

const ParentForm = ({
	setOpen,
	type,
	data,
	relatedData,
}: {
	setOpen: Dispatch<SetStateAction<boolean>>;
	type: 'create' | 'update';
	data?: any;
	relatedData?: any;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ParentSchema>({ resolver: zodResolver(parentSchema) });

	const router = useRouter();

	const [state, formAction] = useFormState(
		type === 'create' ? createParent : updateParent,
		{ success: false, error: false }
	);

	useEffect(() => {
		if (state.success) {
			toast(`Parent ${type}d successfully!`);
			setOpen(false);
			router.refresh();
		}
	}, [state]);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction(data);
	});

	return (
		<form className='flex flex-col gap-8' onSubmit={onSubmit}>
			<h1 className='text-xl font-semibold'>Create a new Parent</h1>
			<span className='text-xs text-gray-400 font-medium'>
				Authentication Information
			</span>

			<div className='flex justify-between flex-wrap gap-8'>
				{data && (
					<InputField
						label='Id'
						name='id'
						defaultValue={data.id}
						register={register}
						error={errors?.id}
						hidden
					/>
				)}

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
					label='Name'
					name='name'
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>

				<InputField
					label='Surname'
					name='surname'
					defaultValue={data?.surname}
					register={register}
					error={errors?.surname}
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
			</div>

			{state.error && (
				<span className='text-red-400'>Something went wrong!</span>
			)}

			<button className='bg-blue-400 text-white p-2 rounded-md'>
				{type === 'create' ? 'Create' : 'Update'}
			</button>
		</form>
	);
};

export default ParentForm;
