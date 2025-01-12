'use client';

import { createTeacher, updateTeacher } from '@/lib/actions';
import { teacherSchema, TeacherSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import InputField from '../InputField';

const TeacherForm = ({
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
	} = useForm<TeacherSchema>({ resolver: zodResolver(teacherSchema) });

	const [img, setImg] = useState<any>();

	const router = useRouter();

	const [state, formAction] = useFormState(
		type === 'create' ? createTeacher : updateTeacher,
		{
			success: false,
			error: false,
		}
	);

	useEffect(() => {
		if (state.success) {
			toast(`Teacher ${type}d successfully!`);
			setOpen(false);
			router.refresh();
		}
	}, [state]);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction({ ...data, img: img?.secure_url });
	});

	const { subjects } = relatedData;

	return (
		<form className='flex flex-col gap-8' onSubmit={onSubmit}>
			<h1 className='text-xl font-semibold'>
				{type === 'create' ? 'Create a new Teacher' : 'Update the Teacher'}
			</h1>
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
					defaultValue={data?.birthday.toISOString().split('T')[0]}
					register={register}
					error={errors?.birthday}
				/>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='sex'>
						Sex:
					</label>
					<select
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('sex')}
						defaultValue={data?.sex}
						name='sex'
						id='sex'
					>
						<option value=''>Select...</option>
						<option value='MALE'>Male</option>
						<option value='FEMALE'>Female</option>
					</select>
					{errors?.sex?.message && (
						<p className='text-xs text-red-400'>
							{errors?.sex?.message.toString()}
						</p>
					)}
				</div>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='subjects'>
						Subjects:
					</label>
					<select
						multiple
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('subjects')}
						defaultValue={data?.subjects}
						name='subjects'
						id='subjects'
					>
						{subjects.map((subject: { id: number; name: string }) => (
							<option
								key={subject.id}
								value={subject.id}
								selected={data && subject.id === data.supervisorId}
							>
								{subject.name}
							</option>
						))}
					</select>
					{errors?.subjects?.message && (
						<p className='text-xs text-red-400'>
							{errors?.subjects?.message.toString()}
						</p>
					)}
				</div>

				<CldUploadWidget
					uploadPreset='school'
					onSuccess={(result, { widget }) => {
						setImg(result.info);
						widget.close();
					}}
				>
					{({ open }) => {
						return (
							<div
								className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'
								onClick={() => open()}
							>
								<Image
									src={'/upload.png'}
									alt='upload'
									width={28}
									height={28}
								/>
								<span>Upload a photo</span>
							</div>
						);
					}}
				</CldUploadWidget>
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

export default TeacherForm;
