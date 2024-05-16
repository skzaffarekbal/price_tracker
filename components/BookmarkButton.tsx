'use client';
import useLocalStorage from '@/lib/hook/useLocalStorage';
import Image from 'next/image';
import { MouseEvent, useEffect, useState } from 'react';

interface Props {
  id: string;
}

const BookmarkButton = ({ id }: Props) => {
  const [bookmark, setBookmark] = useState<string[]>([]);
  const [storedBookmarks, setStoredBookmarks] = useLocalStorage<string[]>('bookmarks', []);

  useEffect(() => {
    setBookmark(storedBookmarks);
  }, [storedBookmarks]);

  const bookmarkFunctionality = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmark?.includes(id)) {
      let newBookmark = bookmark.filter((bookmarkId) => bookmarkId != id);
      setStoredBookmarks([...newBookmark]);
    } else {
      setStoredBookmarks([...bookmark, id]);
    }
  };
  return (
    <div
      className={`p-2 ${bookmark?.includes(id) ? 'bg-[#FFF0F0]' : 'bg-white-200'} rounded-10`}
      onClick={(e) => bookmarkFunctionality(e)}
    >
      {bookmark?.includes(id) ? (
        <Image src={'/assets/icons/bookmark-red.svg'} alt='bookmark' width={20} height={20} />
      ) : (
        <Image src={'/assets/icons/bookmark.svg'} alt='bookmark' width={20} height={20} />
      )}
    </div>
  );
};

export default BookmarkButton;
