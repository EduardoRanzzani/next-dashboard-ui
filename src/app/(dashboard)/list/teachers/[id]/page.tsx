import Announcements from '@/components/Announcements';
import BigCalendar from '@/components/BigCalendar';
import FormModal from '@/components/FormModal';
import Performance from '@/components/Performance';
import Image from 'next/image';
import Link from 'next/link';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const SingleTeacherPage = () => {
  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      {/* LEFT */}
      <div className='w-full xl:w-2/3'>
        {/* TOP */}
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* USER INFO CARD */}
          <div className='bg-lovelySky py-6 px-4 rounded-md flex-1 flex gap-4'>
            <div className='w-1/3'>
              <Image
                src={
                  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200'
                }
                alt='Avatar Image'
                width={144}
                height={144}
                className='w-36 h-36 rounded-full object-cover'
              />
            </div>
            <div className='w-2/3 flex flex-col justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <h1 className='text-xl font-semibold'>
                  Eduardo Leite Ranzzani
                </h1>

                <FormModal
                  table='teacher'
                  type='update'
                  data={{
                    id: 1,
                    username: 'EduhRanzzani',
                    email: 'eduranzzani@gmail.com',
                    password: 'semsenha',
                    firstname: 'Eduardo',
                    lastname: 'Ranzzani',
                    phone: '(67) 992466935',
                    address: '123 Main St, Anytown, USA',
                    bloodType: 'O+',
                    dateOfBirth: '05/01/1993',
                    sex: 'Male',
                    img: 'https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200',
                  }}
                />
              </div>
              <p className='text-sm text-gray-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
              <div className='flex items-center justify-between gap-2 flex-wrap text-sm font-medium'>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image src={'/blood.png'} alt='' width={14} height={14} />
                  <span>O+</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image src={'/date.png'} alt='' width={14} height={14} />
                  <span>05/01/1993</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image src={'/mail.png'} alt='' width={14} height={14} />
                  <span>eduranzzani@gmail.com</span>
                </div>
                <div className='w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2'>
                  <Image src={'/phone.png'} alt='' width={14} height={14} />
                  <span>(67) 99246-6935</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className='flex-1 flex gap-4 justify-between flex-wrap'>
            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src={'/singleAttendance.png'}
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>90%</h1>
                <span className='text-sm text-gray-400'>Attendance</span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src={'/singleBranch.png'}
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>2</h1>
                <span className='text-sm text-gray-400'>Branches</span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src={'/singleLesson.png'}
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Lessons</span>
              </div>
            </div>

            {/* CARD */}
            <div className='bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]'>
              <Image
                src={'/singleClass.png'}
                alt=''
                width={24}
                height={24}
                className='w-6 h-6'
              />
              <div className=''>
                <h1 className='text-xl font-semibold'>6</h1>
                <span className='text-sm text-gray-400'>Classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className='mt-4 bg-white rounded-md p-4 h-[800px]'>
          <h1 className='text-xl font-semibold'>Teacher's Schedule</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-4'>
        {/* SHORTCUTS */}
        <div className='bg-white p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Shortcuts</h1>
          <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
            <Link className='p-3 rounded-md bg-lovelySkyLight' href={''}>
              Teacher's Classes
            </Link>
            <Link className='p-3 rounded-md bg-lovelyPurpleLight' href={''}>
              Teacher's Students
            </Link>
            <Link className='p-3 rounded-md bg-lovelyYellowLight' href={''}>
              Teacher's Lessons
            </Link>
            <Link className='p-3 rounded-md bg-pink-50' href={''}>
              Teacher's Exams
            </Link>
            <Link className='p-3 rounded-md bg-lovelySkyLight' href={''}>
              Teacher's Assignments
            </Link>
          </div>
        </div>

        {/* PIE CHART */}
        <Performance />

        <Announcements />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
