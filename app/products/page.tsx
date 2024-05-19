import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/actions';
import React from 'react';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const Products = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      {allProducts.length ? (
        <section className='trending-section'>
          <h2 className='section-text'>Products</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
            {allProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <div className='w-full h-[90vh] bg-white-100 flex items-center justify-center'>
          <div className='text-xl text-black opacity-50'>
            <div>Sorry We Have No Product!</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
