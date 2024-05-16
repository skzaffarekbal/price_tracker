import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  offer: {
    title: string;
    content: string;
    offerCount: string;
  };
  productUrl: string;
}

const Offer = ({ offer, productUrl }: Props) => {
  return (
    <div className='w-full h-auto rounded-10 border-l-[3px] bg-white-100 px-5 py-4'>
      <p className='text-lg font-bold text-secondary'>{offer.title}</p>
      <p className='text-base text-black-100'>{offer.content}</p>
      <Link href={productUrl} target='_blank' className='flex gap-2 mt-4'>
        <Image src='/assets/icons/price-tag.svg' alt='offer' width={24} height={24} />
        <p className='text-lg font-bold text-black-100'>{offer.offerCount}</p>
      </Link>
    </div>
  );
};

export default Offer;
