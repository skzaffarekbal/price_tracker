import { BasicObject } from '@/types';
import Image from 'next/image';

interface Props {
  title: string;
  detailsList?: BasicObject[];
  featuresList?: string[];
  isCard: boolean;
}

const DetailCard = ({ title, detailsList = [], featuresList = [], isCard }: Props) => {
  return (
    <div className='flex flex-col gap-5'>
      <h3 className='text-2xl text-secondary font-semibold'>{title}</h3>

      {isCard ? (
        <div className='w-full h-auto rounded-10 border-l-[3px] bg-white-100 px-5 py-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
            {detailsList?.map((item, i) => (
              <div key={i}>
                <p className='text-base text-black-100'>{item.keyName}</p>
                <p className='text-lg font-bold text-secondary break-words'>{item.keyValue}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='w-full h-auto'>
          <ul className='flex flex-col gap-4'>
            {featuresList?.map((item, i) => (
              <li key={i} className='flex gap-2 items-baseline'>
                <Image src='/assets/icons/star.svg' alt='star' width={16} height={16} />
                <div className='text-base text-secondary'>{item}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailCard;
