import BookmarkButton from '@/components/BookmarkButton';
import DetailCard from '@/components/DetailCard';
import Modal from '@/components/Modal';
import Offer from '@/components/Offer';
import PriceDateChart from '@/components/PriceDateChart';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import { getProductById, getSimilarProducts } from '@/lib/actions';
import { formatNumber } from '@/lib/utils';
import { Product } from '@/types';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect('/');

  const similarProducts = await getSimilarProducts(id);

  let priceHistory: { date: string; price: number | null }[] = [
    { date: 'M.R.P', price: product?.originalPrice },
    ...product?.priceHistory?.map((history) => ({
      date: moment(history.date).format('D/M/YY HH:MM'),
      price: history.price,
    })),
  ];

  return (
    <div className='product-container'>
      <div className='flex gap-28 xl:flex-row flex-col'>
        <div
          className={`product-image ${
            product?.sellerBackOut || !product.currentPrice ? 'border-red-300' : 'border-[#CDDBFF]'
          } relative`}
        >
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className='mx-auto'
          />
          <div className='h-auto w-auto absolute top-4 md:top-8 left-4'>
            <div
              className={`font-extrabold ${
                product?.sellerBackOut || !product.currentPrice
                  ? 'bg-[#FFF0F0] text-primary border-primary'
                  : 'bg-[#eff2f8] text-blue-500 border-blue-500'
              } font-mono text-[10px] md:text-base px-2 md:pr-4 py-[2px] border-[1px] rounded-full flex items-center gap-1 md:gap-2`}
            >
              <div
                className={`w-2 h-2 md:h-3 md:w-3 bg-white rounded-full ${
                  product?.sellerBackOut || !product.currentPrice
                    ? 'border-primary'
                    : 'border-blue-500'
                } border-[1px]`}
              ></div>
              <div>
                {product?.sellerBackOut
                  ? 'Seller Back Out'
                  : !product.currentPrice
                  ? 'Sold Out'
                  : `${product.discount}% OFF`}
              </div>
            </div>
          </div>
        </div>

        <div className='flex-1 flex flex-col'>
          <div className='flex justify-between items-start gap-5 flex-wrap pb-6'>
            <div className='flex flex-col gap-3'>
              <p className='text-[28px] text-secondary font-semibold'>{product.title}</p>

              <Link href={product.url} target='_blank' className='text-base text-black opacity-50'>
                Visit Product
              </Link>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <div className='product-hearts'>
                <Image src='/assets/icons/red-heart.svg' alt='heart' width={20} height={20} />

                <p className='text-base font-semibold text-[#D46F77]'>{product.reviewsCount}</p>
              </div>

              {/* <div className='p-2 bg-white-200 rounded-10'>
                <Image src='/assets/icons/bookmark.svg' alt='bookmark' width={20} height={20} />
              </div> */}

              <BookmarkButton id={id} />

              <div className='p-2 bg-white-200 rounded-10'>
                <Image src='/assets/icons/share.svg' alt='share' width={20} height={20} />
              </div>

              <div>
                {product?.productFrom === 'amazon' ? (
                  <Link href={product.url} target='_blank'>
                    <Image src='/assets/icons/amazon.svg' alt='amazon' width={85} height={85} />
                  </Link>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          <div className='product-info'>
            <div className='flex flex-col gap-2'>
              {product.currentPrice ? (
                <p className='text-[34px] text-secondary font-bold'>
                  {product.currency} {formatNumber(product.currentPrice)}
                </p>
              ) : (
                <p className='text-md text-primary font-bold'>{'Currently Unavailable.'}</p>
              )}
              <p>
                <span className='text-[21px] text-black opacity-50 line-through'>
                  {product.currency} {formatNumber(product.originalPrice)}
                </span>{' '}
                {product.discount ? (
                  <span className='text-[21px] text-primary font-semibold'>
                    -{product.discount}%
                  </span>
                ) : (
                  ''
                )}
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              <div className='flex gap-3'>
                <div className='product-stars'>
                  <Image src='/assets/icons/star.svg' alt='star' width={16} height={16} />
                  <p className='text-sm text-primary-orange font-semibold'>{product.stars}</p>
                </div>

                <div className='product-reviews'>
                  <Image src='/assets/icons/comment.svg' alt='comment' width={16} height={16} />
                  <p className='text-sm text-secondary font-semibold'>
                    {product.reviewsCount} Reviews
                  </p>
                </div>

                <div>
                  {product?.sellerBackOut ? (
                    <Link title='Seller Back-Out Product' href={product.url} target='_blank'>
                      <Image
                        src='/assets/icons/back-out.svg'
                        alt='back-out'
                        width={50}
                        height={50}
                      />
                    </Link>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              <p className='text-sm text-black opacity-50'>
                <span className='text-primary-green font-semibold'>
                  {((product.stars / 5) * 100).toFixed(0)}%{' '}
                </span>{' '}
                of buyers have recommended this.
              </p>
            </div>
          </div>

          <div className='my-7 flex flex-col gap-5'>
            <div className='flex gap-5 flex-wrap'>
              <PriceInfoCard
                title='Current Price'
                iconSrc='/assets/icons/price-tag.svg'
                value={
                  product.currentPrice
                    ? `${product.currency} ${formatNumber(product.currentPrice)}`
                    : `${product.currentPrice}`
                }
              />
              <PriceInfoCard
                title='Average Price'
                iconSrc='/assets/icons/chart.svg'
                value={`${product.currency} ${formatNumber(product.averagePrice)}`}
              />
              <PriceInfoCard
                title='Highest Price'
                iconSrc='/assets/icons/arrow-up.svg'
                value={`${product.currency} ${formatNumber(product.highestPrice)}`}
              />
              <PriceInfoCard
                title='Lowest Price'
                iconSrc='/assets/icons/arrow-down.svg'
                value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
              />
            </div>
          </div>

          <Modal productId={id} />
        </div>
      </div>

      <div className='flex flex-col gap-16'>
        {priceHistory?.length ? <PriceDateChart priceHistory={priceHistory} /> : ''}

        {product?.offers?.length ? (
          <div className='flex flex-col gap-5'>
            <h3 className='text-2xl text-secondary font-semibold'>Offers</h3>

            <div className='flex flex-col gap-3'>
              {product?.offers?.map((offer, i) => (
                <Offer key={i} offer={offer} productUrl={product?.url} />
              ))}
            </div>
          </div>
        ) : (
          ''
        )}

        {product?.productOverView?.length ? (
          <DetailCard
            title={'Product Overview'}
            detailsList={product?.productOverView}
            isCard={true}
          />
        ) : (
          ''
        )}

        {product?.productFeatures?.length ? (
          <DetailCard
            title={'Product Features'}
            featuresList={product?.productFeatures}
            isCard={false}
          />
        ) : (
          ''
        )}

        {product?.productFullDetail?.length ? (
          <DetailCard
            title={'Product Full Details'}
            detailsList={product?.productFullDetail}
            isCard={true}
          />
        ) : (
          ''
        )}

        {product?.productOverView?.length ||
        product?.productFeatures?.length ||
        product?.productFullDetail?.length ? (
          ''
        ) : (
          <div className='flex flex-col gap-5'>
            <h3 className='text-2xl text-secondary font-semibold'>Product Description</h3>

            <div className='flex flex-col gap-4'>{product?.description?.split('\n')}</div>
          </div>
        )}

        <button className='btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]'>
          <Image src='/assets/icons/bag.svg' alt='check' width={22} height={22} />

          <Link href='/' className='text-base text-white'>
            Buy Now
          </Link>
        </button>
      </div>

      {similarProducts && similarProducts?.length > 0 && (
        <div className='py-14 flex flex-col gap-2 w-full'>
          <p className='section-text'>Similar Products</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
            {similarProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
