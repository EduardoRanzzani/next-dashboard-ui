import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUserId, role } from '@/lib/utils';
import { Announcement, Class, Prisma } from '@prisma/client';
import Image from 'next/image';

type AnnouncementList = Announcement & { class: Class };

const columns = [
	{
		header: 'Title',
		acessor: 'title',
	},
	{
		header: 'Class',
		acessor: 'class',
	},
	{
		header: 'Date',
		acessor: 'date',
		className: 'hidden md:table-cell',
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

const renderRow = (item: AnnouncementList) => (
	<tr
		key={item.id}
		className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lovelySkyLight'
	>
		<td className='flex items-center gap-4 p-4'>{item.title}</td>
		<td>{item.class?.name || '---'}</td>
		<td className='hidden md:table-cell'>
			{new Intl.DateTimeFormat('pt-BR').format(item.date)}
		</td>
		<td>
			<div className='flex items-center gap-2'>
				{role === 'admin' && (
					<>
						<FormModal table='announcement' type='update' data={item} />
						<FormModal table='announcement' type='delete' id={item.id} />
					</>
				)}
			</div>
		</td>
	</tr>
);
const AnnouncementListPage = async ({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) => {
	const { page, ...queryParams } = searchParams;

	const atualPage = page ? parseInt(page) : 1;

	// URL PARAM CONDITION
	const query: Prisma.AnnouncementWhereInput = {};

	query.title = {};

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value !== undefined) {
				switch (key) {
					case 'search':
						// query.OR = [
						//   {
						//     title: { contains: value, mode: 'insensitive' },
						//   },
						//   {
						//     class: { name: { contains: value, mode: 'insensitive' } },
						//   },
						// ];
						query.title = { contains: value, mode: 'insensitive' };
						break;
					default:
						break;
				}
			}
		}
	}

	// ROLE CONDITIONS
	const roleConditions = {
		teacher: { lessons: { some: { teacherId: currentUserId! } } },
		student: { students: { some: { id: currentUserId! } } },
		parent: { students: { some: { parentId: currentUserId! } } },
	};

	if (role !== 'admin') {
		query.OR = [
			{ classId: null },
			{
				class: roleConditions[role as keyof typeof roleConditions] || {},
			},
		];
	}

	const [data, count] = await prisma.$transaction([
		prisma.announcement.findMany({
			where: query,
			include: {
				class: { select: { name: true } },
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (atualPage - 1),
		}),
		prisma.announcement.count({ where: query }),
	]);

	return (
		<div className='bg-white p-4 rounded-md flex-1 m-4 mt-0'>
			{/* TOP */}
			<div className='flex items-center justify-between'>
				<h1 className='hidden md:block text-lg font-semibold'>
					All Announcements
				</h1>
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
							<FormModal table='announcement' type='create' />
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

export default AnnouncementListPage;
