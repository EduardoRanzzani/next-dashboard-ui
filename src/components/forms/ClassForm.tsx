'use client';

import { classSchema, ClassSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { createClass, updateClass } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import SelectField from '../SelectField';

const ClassForm = ({
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
	} = useForm<ClassSchema>({ resolver: zodResolver(classSchema) });
	const router = useRouter();

	const [state, formAction] = useFormState(
		type === 'create' ? createClass : updateClass,
		{
			success: false,
			error: false,
		}
	);

	useEffect(() => {
		if (state.success) {
			toast(`Class ${type === 'create' ? 'created' : 'updated'} successfully!`);
			setOpen(false);
			router.refresh();
		}
	}, [state]);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction(data);
	});

	const { grades, teachers } = relatedData || {};

	return (
		<form className='flex flex-col gap-8' onSubmit={onSubmit}>
			<h1 className='text-xl font-semibold'>
				{type === 'create' ? 'Create a new ' : 'Update a'} Class
			</h1>

			<div className='flex justify-between flex-wrap gap-4'>
				{data && (
					<InputField
						label='Id'
						name='id'
						defaultValue={data?.id}
						register={register}
						error={errors?.id}
						hidden
					/>
				)}

				<InputField
					label='Class Name'
					name='name'
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>

				<InputField
					label='Capacity'
					name='capacity'
					defaultValue={data?.capacity}
					register={register}
					error={errors?.capacity}
					type='number'
				/>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='supervisorId'>
						Supervisor:
					</label>
					<select
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('supervisorId')}
						defaultValue={data?.supervisorId}
						name='supervisorId'
						id='supervisorId'
					>
						{teachers.map(
							(teacher: { id: string; name: string; surname: string }) => (
								<option
									key={teacher.id}
									value={teacher.id}
									selected={data && teacher.id === data.supervisorId}
								>
									{teacher.name + ' ' + teacher.surname}
								</option>
							)
						)}
					</select>
					{errors?.supervisorId?.message && (
						<p className='text-xs text-red-400'>
							{errors?.supervisorId?.message.toString()}
						</p>
					)}
				</div>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='gradeId'>
						Grade:
					</label>
					<select
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('gradeId')}
						defaultValue={data?.gradeId}
						name='gradeId'
						id='gradeId'
					>
						{grades.map((grade: { id: string; level: number }) => (
							<option
								key={grade.id}
								value={grade.id}
								selected={data && grade.id === data.gradeId}
							>
								{grade.level}
							</option>
						))}
					</select>
					{errors?.gradeId?.message && (
						<p className='text-xs text-red-400'>
							{errors?.gradeId?.message.toString()}
						</p>
					)}
				</div>
			</div>

			{state.error && (
				<span className='text-red-500'>Something went wrong!</span>
			)}

			<button className='bg-blue-400 text-white p-2 rounded-md'>
				{type === 'create' ? 'Create' : 'Update'}
			</button>
		</form>
	);
};

export default ClassForm;
