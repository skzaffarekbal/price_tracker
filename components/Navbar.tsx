import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'search' },
  { src: '/assets/icons/red-heart.svg', alt: 'heart' },
  { src: '/assets/icons/user.svg', alt: 'user' },
];

const Navbar = () => {
  return (
    <header className='w-full'>
      <nav className='nav'>
        <Link href='/' className='flex items-center gap-1'>
          <Image src='/assets/icons/logo.svg' width={27} height={27} alt='logo' />
          <p className='nav-logo'>
            Price<span className='text-primary'>Tracker</span>
          </p>
        </Link>
        <div className='flex items-center gap-5'>
          <Link href={'/products'}>
            <Image
              src={'/assets/icons/search.svg'}
              width={28}
              height={28}
              alt={'search'}
              className='object-contain'
            />
          </Link>
          <Link href={'/bookmarks'}>
            <Image
              src={'/assets/icons/red-heart.svg'}
              width={28}
              height={28}
              alt={'heart'}
              className='object-contain'
            />
          </Link>
          <Link href={'#'}>
            <Image
              src={'/assets/icons/user.svg'}
              width={28}
              height={28}
              alt={'user'}
              className='object-contain'
            />
          </Link>
          {/* {navIcons?.map((icon) => (
            <Link key={icon.alt} href={(icon.alt = 'heart' ? '/bookmarks' : icon.alt = 'heart' ? '/products' : '#')}>
              <Image
                src={icon.src}
                width={28}
                height={28}
                alt={icon.alt}
                className='object-contain'
              />
            </Link>
          ))} */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
