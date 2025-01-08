import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { role } from '@/lib/utils';
import { Class, Prisma, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type StudentList = Student & { class: Class };

const columns = [
	{
		header: 'Info',
		acessor: 'info',
	},
	{
		header: 'Student ID',
		acessor: 'studentId',
		className: 'hidden md:table-cell',
	},
	{
		header: 'Grade',
		acessor: 'grade',
		className: 'hidden md:table-cell',
	},
	{
		header: 'Phone',
		acessor: 'phone',
		className: 'hidden lg:table-cell',
	},
	{
		header: 'Address',
		acessor: 'address',
		className: 'hidden lg:table-cell',
	},
	...(role === 'admin'
		? [
				{
					header: 'Actions',
					acessor: 'action',
				},
		  ]
		: []),
];

const renderRow = (item: StudentList) => (
	<tr
		key={item.id}
		className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lovelySkyLight'
	>
		<td className='flex items-center gap-4 p-4'>
			<Image
				src={item.img || '/noAvatar.png'}
				alt={item.name}
				width={40}
				height={40}
				className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
			/>
			<div className='flex flex-col'>
				<h3 className='font-semibold'>{item.name}</h3>
				<p className='text-xs text-gray-500'>{item.class.name}</p>
			</div>
		</td>
		<td className='hidden md:table-cell'>{item.username}</td>
		<td className='hidden md:table-cell'>{item.class.name}</td>
		<td className='hidden md:table-cell'>{item.phone}</td>
		<td className='hidden md:table-cell'>{item.address}</td>
		<td>
			<div className='flex items-center gap-2'>
				<Link href={`/list/students/${item.id}`}>
					<button className='w-7 h-7 flex items-center justify-center rounded-full bg-lovelySky'>
						<Image src={'/view.png'} alt='View data' width={16} height={16} />
					</button>
				</Link>
				{role === 'admin' && (
					// <button className='w-7 h-7 flex items-center justify-center rounded-full bg-lovelyPurple'>
					//   <Image
					//     src={'/delete.png'}
					//     alt='Delete row'
					//     width={16}
					//     height={16}
					//   />
					// </button>
					<FormModal table='student' type='delete' id={item.id} />
				)}
			</div>
		</td>
	</tr>
);

const StudentListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { page, ...queryParams } = searchParams;

	const atualPage = page ? parseInt(page) : 1;

	// URL PARAM CONDITION
	const query: Prisma.StudentWhereInput = {};
	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case 'teacherId':
						query.class = {
							lessons: {
								some: {
									teacherId: value,
								},
							},
						};
						break;
					case 'search':
						query.OR = [
							{
								name: {
									contains: value,
									mode: 'insensitive',
								},
							},
						];
						break;
					default:
						break;
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.student.findMany({
			where: query,
			include: {
				class: true,
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (atualPage - 1),
		}),
		prisma.student.count({ where: query }),
	]);

	return (
		<div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
			{/* TOP */}
			<div className='flex items-center justify-between'>
				<h1 className='hidden md:block text-lg font-semibold'>All Students</h1>
				<div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
					<TableSearch />
					<div className='flex items-center gap-4 self-end'>
						<button className='w-8 h-8 flex items-center justify-center rounded-full bg-lovelyYellow'>
							<Image src={'/filter.png'} alt='filter' width={14} height={14} />
						</button>
						<button className='w-8 h-8 flex items-center justify-center rounded-full bg-lovelyYellow'>
							<Image src={'/sort.png'} alt='filter' width={14} height={14} />
						</button>
						{role === 'admin' && (
							// <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lovelyYellow'>
							//   <Image src={'/plus.png'} alt='filter' width={14} height={14} />
							// </button>
							<FormModal table='student' type='create' />
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

export default StudentListPage;
