"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { signIn, useSession, signOut } from 'next-auth/react'  
import  Modal from 'react-modal';
import { useState, useRef } from 'react';   
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiCamera } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { app } from '@/firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
export default function Header() {
    const {data: session} = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [postUploading, setPostUploading] = useState(false);
    const [caption, setCaption] = useState("");
    const db = getFirestore(app);
    function addImageToPost(e) {
        const file = e.target.files[0];
        if(file){
            setSelectedFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }

    useEffect(() => {
        if(selectedFile){
            uploadImageToStorage();
        }
    }, [selectedFile]);

    async function uploadImageToStorage() {
        setImageFileUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + selectedFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error(error);
                setImageFileUploading(false);
                setImageFileUrl(null);
                setSelectedFile(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL);
                    setImageFileUploading(false);
                });
            }
        )
    }
    async function handleSubmit() {
        setPostUploading(true);
        const docRef = await addDoc(collection(db, "posts"), {
            username: session.user.username,
            caption,
            profileImg: session.user.image,
            image: imageFileUrl,
            timestamp: serverTimestamp(),
        });
        setPostUploading(false);
        setIsOpen(false);
    }


  return (
    <div className="shadow-sm border-b sticky top-0 bg-white z-30 p-3 ">
      <div className="flex justify-between items-center max-w-6xl mx-auto  ">
        {/* Logo */}
        <Link href="/" className="hidden lg:inline-flex">
          <Image
            src="/assets/Instagram_logo_black.webp"
            width={96}
            height={96}
            alt="logo"
          />
        </Link>
        <Link href="/" className="lg:hidden ">
          <Image
            src="/assets/800px-Instagram_logo_2016.webp"
            width={40}
            height={40}
            alt="logo"
          />
        </Link>

        {/* Search input */}
        <input
          type="text"
          placeholder="search"
          className="bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px] "
        />

        {/* menu Items */}
        {session ? (
          <div className="flex items-center gap-2">
            <IoMdAddCircleOutline
              className="text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600 "
              onClick={() => setIsOpen(true)}
            />

            <img
              src={session.user.image}
              alt={session.user.name}
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={signOut}
            />
          </div>
        ) : (
          <button
            onClick={signIn}
            className="text-sm font-semibold text-blue-500"
          >
            Log In
          </button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          className=" max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-md shadow-md  "
          onRequestClose={() => setIsOpen(false)}
          ariaHideApp={false}
        >
          <div className="flex flex-col justify-center items-center h-[100%] ">
          {selectedFile ? (
                <img
                onClick={() => setSelectedFile(null) }
                    src={imageFileUrl}
                    alt="selected file"
                    className= {`max-h-[200px] max-w-lg object-over cursor-pointer ${imageFileUploading ? 'animate-pulse' : '' } `}
                />
                ) : (
          
            <HiCamera onClick={() => filePickerRef.current.click() } className=" text-5xl text-gray-400 cursor-pointer " />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="file"
              onChange={addImageToPost}
              ref={filePickerRef}
            />

            <input
              type="text"
              maxLength="150"
              placeholder="Please enter your caption..."
              className="m-4 border-none text-center w-full focus:ring-0 outline-none "
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
            onClick={handleSubmit}
              disabled = {
                !selectedFile || !caption.trim() === '' || postUploading || imageFileUploading
              }
              className="w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:brightness-100 "
            >
              {" "}
              Upload Post
            </button>
            
          </div>
          <AiOutlineClose className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300 ' onClick={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
