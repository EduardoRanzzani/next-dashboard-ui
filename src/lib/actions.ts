'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

import {
	ClassSchema,
	ExamSchema,
	ParentSchema,
	StudentSchema,
	SubjectSchema,
	TeacherSchema,
} from './formValidationSchema';
import prisma from './prisma';

type CurrentState = { success: boolean; error: boolean };

export const createTeacher = async (
	currentState: CurrentState,
	data: TeacherSchema
) => {
	try {
		const client = await clerkClient();
		const user = await client.users.createUser({
			skipPasswordChecks: true,
			skipPasswordRequirement: true,
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: 'teacher' },
		});

		await prisma.teacher.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email,
				phone: data.phone,
				address: data.address,
				img: data.img,
				bloodType: data.bloodType,
				birthday: data.birthday,
				sex: data.sex,
				subjects: {
					connect: data.subjects?.map((subjectId: string) => ({
						id: parseInt(subjectId),
					})),
				},
			},
		});

		// revalidatePath('/list/teachers');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const updateTeacher = async (
	currentState: CurrentState,
	data: TeacherSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}

	const client = await clerkClient();
	try {
		const user = await client.users.updateUser(data.id, {
			username: data.username,
			...(data.password !== '' && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		await prisma.teacher.update({
			where: {
				id: data.id,
			},
			data: {
				...(data.password !== '' && { password: data.password }),
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email,
				phone: data.phone,
				address: data.address,
				img: data.img,
				bloodType: data.bloodType,
				birthday: data.birthday,
				sex: data.sex,
				subjects: {
					set: data.subjects?.map((subjectId: string) => ({
						id: parseInt(subjectId),
					})),
				},
			},
		});

		// revalidatePath('/list/teachers');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteTeacher = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;
	try {
		await prisma.teacher.delete({
			where: {
				id: id,
			},
		});

		const client = await clerkClient();
		const user = await client.users.getUser(id);

		if (user) {
			await client.users.deleteUser(id);
		}

		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const createStudent = async (
	currentState: CurrentState,
	data: StudentSchema
) => {
	try {
		const classItem = await prisma.class.findUnique({
			where: { id: data.classId },
			include: { _count: { select: { students: true } } },
		});

		if (classItem && classItem.capacity === classItem._count.students) {
			return { success: false, error: true };
		}

		const client = await clerkClient();
		const user = await client.users.createUser({
			skipPasswordChecks: true,
			skipPasswordRequirement: true,
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: 'student' },
		});

		await prisma.student.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email,
				phone: data.phone,
				address: data.address,
				img: data.img,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				gradeId: data.gradeId,
				classId: data.classId,
				parentId: data.parentId,
			},
		});

		// revalidatePath('/list/teachers');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const updateStudent = async (
	currentState: CurrentState,
	data: StudentSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}

	const client = await clerkClient();
	try {
		await prisma.student.update({
			where: {
				id: data.id,
			},
			data: {
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email,
				phone: data.phone,
				address: data.address,
				img: data.img,
				bloodType: data.bloodType,
				sex: data.sex,
				birthday: data.birthday,
				gradeId: data.gradeId,
				classId: data.classId,
				parentId: data.parentId,
			},
		});

		const user = await client.users.updateUser(data.id, {
			username: data.username,
			...(data.password !== '' && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		// revalidatePath('/list/teachers');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteStudent = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;
	try {
		await prisma.student.delete({
			where: {
				id: id,
			},
		});

		const client = await clerkClient();
		const user = await client.users.getUser(id);

		if (user) {
			await client.users.deleteUser(id);
		}

		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const createParent = async (
	currentState: CurrentState,
	data: ParentSchema
) => {
	try {
		const client = await clerkClient();
		const user = await client.users.createUser({
			skipPasswordChecks: true,
			skipPasswordRequirement: true,
			username: data.username,
			password: data.password,
			firstName: data.name,
			lastName: data.surname,
			publicMetadata: { role: 'parent' },
		});

		await prisma.parent.create({
			data: {
				id: user.id,
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email || null,
				phone: data.phone || null,
				address: data.address,
			},
		});

		// revalidatePath("/list/parents");
		return { success: true, error: false };
	} catch (err) {
		console.log(err);
		return { success: false, error: true };
	}
};

export const updateParent = async (
	currentState: CurrentState,
	data: ParentSchema
) => {
	if (!data.id) {
		return { success: false, error: true };
	}

	try {
		await prisma.parent.update({
			where: {
				id: data.id,
			},
			data: {
				username: data.username,
				name: data.name,
				surname: data.surname,
				email: data.email,
				phone: data.phone,
				address: data.address,
			},
		});

		const client = await clerkClient();
		const user = await client.users.updateUser(data.id, {
			username: data.username,
			...(data.password !== '' && { password: data.password }),
			firstName: data.name,
			lastName: data.surname,
		});

		// revalidatePath('/list/parents');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteParent = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;
	try {
		await prisma.parent.delete({
			where: {
				id: id,
			},
		});

		const client = await clerkClient();
		const user = await client.users.getUser(id);
		if (user) {
			await client.users.deleteUser(id);
		}

		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const createSubject = async (
	currentState: CurrentState,
	data: SubjectSchema
) => {
	try {
		await prisma.subject.create({
			data: {
				name: data.name,
				teachers: {
					connect: data.teachers.map((teacherId) => ({ id: teacherId })),
				},
			},
		});

		// revalidatePath('/list/subjects');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const updateSubject = async (
	currentState: CurrentState,
	data: SubjectSchema
) => {
	try {
		await prisma.subject.update({
			where: { id: data.id },
			data: {
				name: data.name,
				teachers: {
					set: data.teachers.map((teacherId) => ({ id: teacherId })),
				},
			},
		});
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteSubject = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;
	try {
		await prisma.subject.delete({
			where: {
				id: parseInt(id),
			},
		});
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const createClass = async (
	currentState: CurrentState,
	data: ClassSchema
) => {
	try {
		await prisma.class.create({
			data,
		});

		// revalidatePath('/list/classes');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const updateClass = async (
	currentState: CurrentState,
	data: ClassSchema
) => {
	try {
		await prisma.class.update({
			where: { id: data.id },
			data,
		});
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteClass = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;
	try {
		await prisma.class.delete({
			where: {
				id: parseInt(id),
			},
		});
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const createExam = async (
	currentState: CurrentState,
	data: ExamSchema
) => {
	const { userId, sessionClaims } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		if (role === 'teacher') {
			const teacherLesson = await prisma.lesson.findFirst({
				where: {
					teacherId: userId!,
					id: data.lessonId,
				},
			});

			if (!teacherLesson) {
				return { success: false, error: true };
			}
		}

		await prisma.exam.create({
			data: {
				title: data.title,
				startTime: data.startTime,
				endTime: data.endTime,
				lessonId: data.lessonId,
			},
		});

		// revalidatePath('/list/subjects');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const updateExam = async (
	currentState: CurrentState,
	data: ExamSchema
) => {
	const { userId, sessionClaims } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		if (role === 'teacher') {
			const teacherLesson = await prisma.lesson.findFirst({
				where: {
					teacherId: userId!,
					id: data.lessonId,
				},
			});

			if (!teacherLesson) {
				return { success: false, error: true };
			}
		}

		await prisma.exam.update({
			where: {
				id: data.id,
			},
			data: {
				title: data.title,
				startTime: data.startTime,
				endTime: data.endTime,
				lessonId: data.lessonId,
			},
		});

		// revalidatePath('/list/exams');
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};

export const deleteExam = async (
	currentState: CurrentState,
	data: FormData
) => {
	const id = data.get('id') as string;

	const { userId, sessionClaims } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;

	try {
		await prisma.exam.delete({
			where: {
				id: parseInt(id),
				...(role === 'teacher' ? { lesson: { teacherId: userId! } } : {}),
			},
		});
		return { success: true, error: false };
	} catch (error) {
		console.error(error);
		return { success: false, error: true };
	}
};
