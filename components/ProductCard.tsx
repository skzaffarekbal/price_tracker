import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import BookmarkButton from './BookmarkButton';

interface Props {
  product: Product;
}
const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/products/${product?._id}`} className='product-card'>
      <div className='product-card_img-container relative'>
        <Image
          src={product?.image}
          alt={product?.title}
          width={200}
          height={200}
          className='product-card_img'
        />
        <div className='h-auto w-auto absolute top-4 md:top-8 left-4'>
          <div
            className={`font-extrabold ${
              product?.sellerBackOut || !product.currentPrice
                ? 'bg-[#FFF0F0] text-primary border-primary'
                : 'bg-[#eff2f8] text-blue-500 border-blue-500'
            } font-mono text-[10px] px-2 py-[2px] border-[1px] rounded-full`}
          >
            {product?.sellerBackOut
              ? 'Seller Back Out'
              : !product.currentPrice
              ? 'Sold Out'
              : `${product.discount}% OFF`}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <h3 className='product-title'>{product?.title}</h3>

        <div className='flex justify-between'>
          {/* <p className='text-black opacity-50 text-lg capitalize'>{product?.category}</p> */}
          <div className='flex gap-2 items-baseline'>
            {product?.currentPrice ? (
              <p className='text-black text-lg font-semibold'>
                <span>{product?.currency}</span>
                <span>{product?.currentPrice}</span>
              </p>
            ) : (
              <p className='text-md text-primary font-bold'>{'Unavailable.'}</p>
            )}
            <p className='text-md text-black opacity-50 line-through'>
              <span>{product?.currency}</span>
              <span>{product?.originalPrice}</span>
            </p>
          </div>

          {/* <div className='flex gap-2'>
            <div className='product-stars'>
              <Image src='/assets/icons/star.svg' alt='star' width={16} height={16} />
              <p className='text-sm text-primary-orange font-semibold'>{product.stars}</p>
            </div>
          </div> */}
          <div>
            <Image src='/assets/icons/amazon-icon.svg' alt='amazon' width={24} height={24} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
