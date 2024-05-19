'use client';
import ProductCard from '@/components/ProductCard';
import useLocalStorage from '@/lib/hook/useLocalStorage';
import { Product } from '@/types';
import React, { useEffect, useState } from 'react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [bookmarkProducts, setBookmarkProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storedBookmarks, setStoredBookmarks] = useLocalStorage<string[]>('bookmarks', []);

  useEffect(() => {
    setBookmarks(storedBookmarks);
  }, [storedBookmarks]);

  useEffect(() => {
    if (bookmarks.length > 0) {
      setIsLoading(true);
      setError(null);

      fetch(`/api/bookmarks?ids=${bookmarks.join(',')}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch bookmarked products');
          }
          return response.json();
        })
        .then((data) => {
          if (!data.error) setBookmarkProducts(data.bookmarkProducts);
          else setError(data.message);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [bookmarks]);

  return (
    <div>
      {isLoading && (
        <div className='w-full h-[90vh] bg-white-100 flex items-center justify-center'>
          <div className='text-xl text-black opacity-50'>Loading...</div>
        </div>
      )}
      {error && (
        <div className='w-full h-[90vh] bg-white-100 flex items-center justify-center'>
          <div className='text-xl text-red-500 opacity-50'>{error}</div>
        </div>
      )}
      {!isLoading && !error && (
        <>
          {bookmarkProducts.length > 0 ? (
            <section className='trending-section'>
              <h2 className='section-text'>Bookmarks</h2>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
                {bookmarkProducts?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          ) : (
            <div className='w-full h-[90vh] bg-white-100 flex items-center justify-center'>
              <div className='text-xl text-black opacity-50'>No Product is Bookmarked.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Bookmarks;
