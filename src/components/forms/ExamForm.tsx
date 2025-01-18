'use client';

import {
	examSchema,
	ExamSchema,
	subjectSchema,
	SubjectSchema,
} from '@/lib/formValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import {
	createExam,
	createSubject,
	updateExam,
	updateSubject,
} from '@/lib/actions';
import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ExamForm = ({
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
	} = useForm<ExamSchema>({ resolver: zodResolver(examSchema) });
	const router = useRouter();

	// AFTER REACT 19 IT'LL BE USEACTIONSTATE
	const [state, formAction] = useFormState(
		type === 'create' ? createExam : updateExam,
		{
			success: false,
			error: false,
		}
	);

	useEffect(() => {
		if (state.success) {
			toast(`Exam ${type}d successfully!`);
			setOpen(false);
			router.refresh();
		}
	}, [state]);

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		formAction(data);
	});

	const { lessons } = relatedData || {};

	return (
		<form className='flex flex-col gap-8' onSubmit={onSubmit}>
			<h1 className='text-xl font-semibold'>
				{type === 'create' ? 'Create a new ' : 'Update a '} Exam
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
					label='Exam Title'
					name='title'
					defaultValue={data?.title}
					register={register}
					error={errors?.title}
				/>

				<InputField
					label='Start date'
					name='startTime'
					defaultValue={data?.startTime}
					register={register}
					type='datetime-local'
					error={errors?.startTime}
				/>

				<InputField
					label='End Time'
					name='endTime'
					defaultValue={data?.endTime}
					register={register}
					error={errors?.endTime}
					type='datetime-local'
				/>

				<div className='flex flex-col gap-2 w-full md:w-1/4'>
					<label className='text-xs text-gray-500' htmlFor='lessons'>
						Lessons:
					</label>
					<select
						className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
						{...register('lessonId')}
						defaultValue={data?.lessonId}
						name='lessons'
						id='lessons'
					>
						{lessons.map((lesson: { id: number; name: string }) => (
							<option key={lesson.id} value={lesson.id}>
								{lesson.name}
							</option>
						))}
					</select>
					{errors.lessonId?.message && (
						<p className='text-xs text-red-400'>
							{errors.lessonId?.message.toString()}
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

export default ExamForm;
