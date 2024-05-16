import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { getAllProducts, getTopProducts, getTrendingProducts } from '@/lib/actions';
import Image from 'next/image';

const Home = async () => {
  const trendingProducts = await getTrendingProducts();
  const topProducts = await getTopProducts();

  return (
    <>
      <section className='px-6 md:px-20 py-24'>
        <div className='flex max-xl:flex-col gap-16'>
          <div className='flex flex-col justify-center'>
            <p className='small-text'>
              Smart Shopping Starts Here:
              <Image src='/assets/icons/arrow-right.svg' alt='arrow-right' width={16} height={16} />
            </p>
            <h1 className='head-text'>
              Effortless Deals with
              <span className='text-primary'> PriceTracker</span>
            </h1>
            <p className='mt-6'>
              Unlock the potential of PriceTracker for effortless price tracking. Stay informed
              about price changes, discover exclusive deals, and make savvy buying decisions to save
              money on your purchases.
            </p>
            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className='trending-section'>
        <h2 className='section-text'>Trending</h2>

        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {trendingProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className='trending-section'>
        <h2 className='section-text'>Most Viewed</h2>

        <div className='flex flex-wrap gap-x-8 gap-y-16'>
          {topProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
