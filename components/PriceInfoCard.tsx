import Image from 'next/image';

interface Props {
  title: string;
  iconSrc: string;
  value: string;
}

const PriceInfoCard = ({ title, iconSrc, value }: Props) => {
  let unavailable = title === 'Current Price' && value === '0';
  return (
    <div className={`price-info_card`}>
      <p className='text-base text-black-100'>{title}</p>

      <div className='flex gap-1'>
        <Image src={iconSrc} alt={title} width={24} height={24} />

        <p
          className={`${
            unavailable ? 'text-md text-primary' : 'text-2xl text-secondary'
          } font-bold`}
        >
          {unavailable ? 'Currently Unavailable.' : value}
        </p>
      </div>
    </div>
  );
};

export default PriceInfoCard;
