import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import Image from 'next/image';

type ResultList = {
	id: number;
	title: string;
	studentName: string;
	studentSurname: string;
	teacherName: string;
	teacherSurname: string;
	score: number;
	className: string;
	startTime: Date;
};

const ResultListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { userId, sessionClaims } = await auth();
	const role = (sessionClaims?.metadata as { role?: string })?.role;
	const currentUserId = userId;

	const columns = [
		{
			header: 'Title',
			acessor: 'title',
		},
		{
			header: 'Student Name',
			acessor: 'student',
		},
		{
			header: 'Score',
			acessor: 'score',
			className: 'hidden md:table-cell',
		},
		{
			header: 'Teacher Name',
			acessor: 'teacher',
			className: 'hidden md:table-cell',
		},
		{
			header: 'Class',
			acessor: 'class',
			className: 'hidden md:table-cell',
		},
		{
			header: 'Date',
			acessor: 'date',
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

	const renderRow = (item: ResultList) => (
		<tr
			key={item.id}
			className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lovelySkyLight'
		>
			<td className='flex items-center gap-4 p-4'>{item.title}</td>
			<td>{item.studentName + [' '] + item.studentSurname}</td>
			<td className='hidden md:table-cell'>{item.score}</td>
			<td className='hidden md:table-cell'>
				{item.teacherName + [' '] + item.teacherSurname}
			</td>
			<td className='hidden md:table-cell'>{item.className}</td>
			<td className='hidden md:table-cell'>
				{new Intl.DateTimeFormat('pt-BR').format(item.startTime)}
			</td>
			<td>
				<div className='flex items-center gap-2'>
					{(role === 'admin' || role === 'teacher') && (
						<>
							<FormModal table='result' type='update' data={item} />
							<FormModal table='result' type='delete' data={item} />
						</>
					)}
				</div>
			</td>
		</tr>
	);

	const { page, ...queryParams } = searchParams;

	const atualPage = page ? parseInt(page) : 1;

	// URL PARAM CONDITION
	const query: Prisma.ResultWhereInput = {};
	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case 'studentId':
						query.studentId = value;
						break;
					case 'search':
						query.OR = [
							{ student: { name: { contains: value, mode: 'insensitive' } } },
							{ exam: { title: { contains: value, mode: 'insensitive' } } },
							{
								assignment: { title: { contains: value, mode: 'insensitive' } },
							},
						];
						break;
					default:
						break;
				}
			}
		}
	}

	// ROLE CONDITIONS
	switch (role) {
		case 'teacher':
			query.OR = [
				{ exam: { lesson: { teacherId: currentUserId! } } },
				{ assignment: { lesson: { teacherId: currentUserId! } } },
			];
			break;
		case 'student':
			query.studentId = currentUserId!;
			break;
		case 'parent':
			query.student = { parentId: currentUserId! };
			break;
		default:
			break;
	}

	const [dataResponse, count] = await prisma.$transaction([
		prisma.result.findMany({
			where: query,
			include: {
				student: { select: { name: true, surname: true } },
				exam: {
					include: {
						lesson: {
							select: {
								class: { select: { name: true } },
								teacher: { select: { name: true, surname: true } },
							},
						},
					},
				},
				assignment: {
					include: {
						lesson: {
							select: {
								class: { select: { name: true } },
								teacher: { select: { name: true, surname: true } },
							},
						},
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (atualPage - 1),
		}),
		prisma.result.count({ where: query }),
	]);

	const data = dataResponse.map((result) => {
		const assessment = result.exam || result.assignment;

		if (!assessment) return null;

		const isExam = 'startTime' in assessment;
		return {
			id: result.id,
			title: assessment.title,
			studentName: result.student.name,
			studentSurname: result.student.surname,
			teacherName: assessment.lesson.teacher.name,
			teacherSurname: assessment.lesson.teacher.surname,
			score: result.score,
			className: assessment.lesson.class.name,
			startTime: isExam ? assessment.startTime : assessment.startDate,
		};
	});

	return (
		<div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
			{/* TOP */}
			<div className='flex items-center justify-between'>
				<h1 className='hidden md:block text-lg font-semibold'>All Results</h1>
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
							<FormModal table='result' type='create' />
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

export default ResultListPage;
