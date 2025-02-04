import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import Image from 'next/image';

type ExamList = Exam & {
	lesson: {
		subject: Subject;
		class: Class;
		teacher: Teacher;
	};
};

const ExamListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { sessionClaims, userId } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const currentUserId = userId;

	const columns = [
		{
			header: 'Subject',
			acessor: 'subject',
		},
		{
			header: 'Class',
			acessor: 'class',
		},
		{
			header: 'Teacher Name',
			acessor: 'teacher',
			className: 'hidden md:table-cell',
		},
		{
			header: 'Date',
			acessor: 'teacher',
			className: 'hidden md:table-cell',
		},
		...(role === 'admin' || role === 'teacher'
			? [
					{
						header: 'Actions',
						acessor: 'action',
					},
			  ]
			: []),
	];

	const renderRow = (item: ExamList) => (
		<tr
			key={item.id}
			className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lovelySkyLight'
		>
			<td className='flex items-center gap-4 p-4'>
				{item.lesson.subject.name}
			</td>
			<td>{item.lesson.class.name}</td>
			<td className='hidden md:table-cell'>
				{item.lesson.teacher.name + [' '] + item.lesson.teacher.surname}
			</td>
			<td className='hidden md:table-cell'>
				{new Intl.DateTimeFormat('pt-BR').format(item.startTime)}
			</td>
			<td>
				<div className='flex items-center gap-2'>
					{(role === 'admin' || role === 'teacher') && (
						<>
							<FormContainer table='exam' type='update' data={item} />
							<FormContainer table='exam' type='delete' id={item.id} />
						</>
					)}
				</div>
			</td>
		</tr>
	);

	const { page, ...queryParams } = searchParams;

	const atualPage = page ? parseInt(page) : 1;

	// URL PARAM CONDITION
	const query: Prisma.ExamWhereInput = {};
	query.lesson = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case 'classId':
						query.lesson.classId = parseInt(value);
						break;
					case 'teacherId':
						query.lesson.teacherId = value;
						break;
					case 'search':
						query.lesson = {
							subject: {
								name: {
									contains: value,
									mode: 'insensitive',
								},
							},
						};
						break;
					default:
						break;
				}
			}
		}
	}

	// ROLE CONDITIONS
	const roleConditions = {
		teacher: { teacherId: currentUserId! },
		student: { class: { students: { some: { id: currentUserId! } } } },
		parent: { class: { students: { some: { parentId: currentUserId! } } } },
	};

	if (role !== 'admin') {
		query.OR = [
			{ lesson: undefined },
			{
				lesson: roleConditions[(role as keyof typeof roleConditions) || {}],
			},
		];
	}

	const [data, count] = await prisma.$transaction([
		prisma.exam.findMany({
			where: query,
			include: {
				lesson: {
					select: {
						teacher: { select: { name: true, surname: true } },
						subject: { select: { name: true } },
						class: { select: { name: true } },
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (atualPage - 1),
		}),
		prisma.exam.count({ where: query }),
	]);

	return (
		<div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
			{/* TOP */}
			<div className='flex items-center justify-between'>
				<h1 className='hidden md:block text-lg font-semibold'>All Exams</h1>
				<div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
					<TableSearch />
					<div className='flex items-center gap-4 self-end'>
						<button className='w-8 h-8 flex items-center justify-center rounded-full bg-lovelyYellow'>
							<Image src={'/filter.png'} alt='filter' width={14} height={14} />
						</button>
						<button className='w-8 h-8 flex items-center justify-center rounded-full bg-lovelyYellow'>
							<Image src={'/sort.png'} alt='filter' width={14} height={14} />
						</button>
						{(role === 'admin' || role === 'teacher') && (
							<FormContainer table='exam' type='create' />
						)}
					</div>
				</div>
			</div>
			{/* LIST */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* PAGINATION */}
			<Pagination page={atualPage} count={count} />
		</div>
	);
};

export default ExamListPage;
