'use client';

import { FormEvent, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';
import { formatNumber } from '@/lib/utils';

interface Props {
  productId: string;
  originalPrice: number;
  lowestPrice: number;
  currentPrice: number;
  currency: string;
}

const Modal = ({ productId, originalPrice, lowestPrice, currentPrice, currency }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [trackPrice, setTrackPrice] = useState(`${lowestPrice}`);
  const [isError, setIsError] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleTrackPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (originalPrice > parseInt(e.target.value)) {
      setTrackPrice(e.target.value);
      setIsError(false);
    } else {
      setTrackPrice(e.target.value);
      setIsError(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isError) return;
    setIsSubmitting(true);

    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false);
    setEmail('');
    setTrackPrice('');
    toggleModal();
  };

  return (
    <>
      <button type='button' className='btn' onClick={toggleModal}>
        Track
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' onClose={toggleModal} className='dialog-container'>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            <span className='inline-block h-screen align-middle' aria-hidden='true' />

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='dialog-content'>
                <div className='flex flex-col'>
                  <div className='flex justify-between'>
                    <div className='p-3 border border-gray-200 rounded-10'>
                      <Image src='/assets/icons/logo.svg' alt='logo' width={28} height={28} />
                    </div>

                    <Image
                      src='/assets/icons/x-close.svg'
                      alt='close'
                      width={24}
                      height={24}
                      className='cursor-pointer'
                      onClick={toggleModal}
                    />
                  </div>

                  <h4 className='dialog-head_text'>
                    Stay updated with product pricing alerts right in your inbox!
                  </h4>

                  <p className='text-sm text-gray-600 mt-2'>
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                  <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                    Email address
                  </label>
                  <div className='dialog-input_container'>
                    <Image src='/assets/icons/mail.svg' alt='mail' width={18} height={18} />

                    <input
                      required
                      type='email'
                      id='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='Enter your email address'
                      className='dialog-input'
                    />
                  </div>

                  <label htmlFor='trackPrice' className='text-sm font-medium text-gray-700 mt-4'>
                    Minimum Track Price
                  </label>
                  <div
                    className={`dialog-input_container ${
                      isError ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <Image src='/assets/icons/price-tag.svg' alt='mail' width={18} height={18} />

                    <div className='flex items-center flex-1'>
                      <div className='text-gray-500 text-base'>{currency}</div>
                      <input
                        required
                        type='number'
                        id='trackPrice'
                        value={trackPrice}
                        onChange={handleTrackPrice}
                        placeholder='Enter Minimum Track Price'
                        className='flex-1 pl-1 border-none text-gray-500 text-base focus:outline-none border border-gray-300 rounded-[27px] shadow-xs'
                      />
                    </div>
                  </div>

                  <button type='submit' className='dialog-btn'>
                    {isSubmitting ? 'Submitting...' : 'Track'}
                  </button>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
