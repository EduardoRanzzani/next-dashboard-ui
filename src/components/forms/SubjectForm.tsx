'use client';

import { subjectSchema, SubjectSchema } from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { createSubject, updateSubject } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SubjectForm = ({
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
	} = useForm<SubjectSchema>({ resolver: zodResolver(subjectSchema) });
	const router = useRouter();

	// AFTER REACT 19 IT'LL BE USEACTIONSTATE
	const [state, formAction] = useFormState(
		type === 'create' ? createSubject : updateSubject,
		{
			success: false,
			error: false,
		}
	);

	useEffect(() => {
		if (state.success) {
			toast(
				`Subject ${type == 'create' ? 'created' : 'updated'} successfully!`
			);
			setOpen(false);
			router.refresh();
		}
	}, [state]);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction(data);
	});

	const { teachers } = relatedData || {};

	return (
		<form className='flex flex-col gap-8' onSubmit={onSubmit}>
			<h1 className='text-xl font-semibold'>
				{type === 'create' ? 'Create a new ' : 'Update a '} Subject
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
					label='Subject Name'
					name='name'
					defaultValue={data?.name}
					register={register}
					error={errors?.name}
				/>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='teachers'>
						Teachers:
					</label>
					<select
						multiple
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('teachers')}
						defaultValue={data?.teachers}
						name='teachers'
						id='teachers'
					>
						{teachers.map(
							(teacher: { id: string; name: string; surname: string }) => (
								<option key={teacher.id} value={teacher.id}>
									{teacher.name + ' ' + teacher.surname}
								</option>
							)
						)}
					</select>
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

export default SubjectForm;
