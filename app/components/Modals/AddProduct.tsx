//@ts-nocheck

'use client'

import React, { useState, useRef, ChangeEvent } from 'react';
import addIcon from '@/app/assets/add.svg';
import Image from 'next/image';
import AlertAtom from '../AlertAtom';
import loader from '@/app/assets/loader.gif';
import { updateModal } from '../../Redux/actions/modals';
import { useDispatch } from 'react-redux';

import ProductInput from '../ProductInput'

import { useAddProductMutation } from '@/app/Redux/services/productsService';
import { conditions, productCategories } from '@/app/utils/productCategories';

interface PictureItemProps {
  pictureUrl: string;
  alt: string;
  onRemove: () => void;
}

export const PictureItem: React.FC<PictureItemProps> = ({ pictureUrl, alt, onRemove }) => (
  <div className="relative">
    <Image
      src={pictureUrl}
      alt={alt}
      className="h-20 w-20 object-cover mr-2 rounded"
      loader={() => pictureUrl}
      width={20}
      height={20}
    />
    <button
      className="absolute -mt-2 top-0 right-[10px] w-4 h-4 bg-red-500 text-white rounded-full flex justify-center items-center"
      onClick={onRemove}
    >
      ×
    </button>
  </div>
);

const AddProduct: React.FC = () => {
  const dispatch = useDispatch();
  const [addProduct, { isLoading: isAddProductLoading }] = useAddProductMutation();
  const initialState = {
    id: '',
    make: '',
    model: '',
    category: productCategories[0],
    pictures: [],
    description: '',
    price: 0,
    colour: '',
    condition: conditions[0],
  };
  const [productData, setProductData] = useState(initialState);
  const [isValid, setIsValid] = useState(true);

  const [errors, setErrors] = useState({
    make: '',
    model: '',
    price: '',
    pictures: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + productData.pictures.length > 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pictures: 'Cannot upload more than 10 pictures',
      }));
      return;
    }

    const pictureFiles: any = files.map((file) => file);
    setProductData((prevState) => ({
      ...prevState,
      pictures: prevState.pictures.concat(pictureFiles),
    }));

    // Reset the file input value after uploading
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      pictures: '', // Clear the error message after successful upload
    }));
  };

  const handleRemovePicture = (index: number) => {
    setProductData((prevState) => {
      const updatedPictures = [...prevState.pictures];
      updatedPictures.splice(index, 1);
      return {
        ...prevState,
        pictures: updatedPictures,
      };
    });
  };

  const validateInputs = () => {
    const newErrors = {
      make: '',
      model: '',
      price: '',
      pictures: '',
    };
    let isValid = true;

    if (productData.make === '') {
      newErrors.make = 'Make is required';
      isValid = false;
    }
    if (productData.model === '') {
      newErrors.model = 'Model is required';
      isValid = false;
    }

    if (productData.price === 0) {
      newErrors.price = 'Price is required';
      isValid = false;
    }

    if (productData.pictures.length < 1) {
      newErrors.pictures = 'Attach Pictures';
      isValid = false;
    }
    setErrors(newErrors);
    setIsValid(isValid);

    return isValid;
  };

  const handleClearErrors = () => {
    setIsValid(true);
    setErrors({
      make: '',
      model: '',
      price: '',
      pictures: '',
    });
  };

  const handleAddProduct = async () => {
    try {
      if (!validateInputs()) {
        return;
      }

      await addProduct(productData).unwrap();
      setProductData(initialState);
      dispatch(updateModal('Congratulations'));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(productData)
  console.log(errors)

  return (
    <div className="container mx-auto overflow-hidden">

      {!isValid && <AlertAtom
        msg='Plese fill in ALL required fields and retry'
        buttonLabel='Ok'
        action={handleClearErrors}
      />
      }
      <div className="flex flex-col justify-center items-center w-full h-[400px] overflow-y-auto">
        <ProductInput
          productData={productData}
          isValid={isValid}
          errors={errors}
          setProductData={setProductData}
          setErrors={setErrors}
          setIsValid={setIsValid}
        />
        <div className="p-2 w-full">
          <label htmlFor="pictures" className="text-md font-medium">
            Pictures:
          </label>
          <div className='grid grid-cols-4 gap-2 mt-2'>
            <div className="flex justify-center items-center h-20 w-20 ">
              <label htmlFor="pictures" className="text-lg font-medium cursor-pointer">
                <Image
                  src={addIcon}
                  alt=""
                  className="w-8 h-8 mr-2"
                  onClick={() => handleAddPictureClick()}
                />
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePictureUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
            {productData.pictures.map((pictureUrl, index) => (
              <PictureItem

                key={index}
                pictureUrl={URL.createObjectURL(pictureUrl)}
                alt={`product Picture ${index + 1}`}
                onRemove={() => handleRemovePicture(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center flex-col'>
        {isAddProductLoading ? (
          <Image
            src={loader}
            alt=''
            width={48}
            height={48}
          />
        ) : (
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 hover:bg-blue-600 text-white  font-medium py-2 px-4 rounded-md"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}


export default AddProduct;



