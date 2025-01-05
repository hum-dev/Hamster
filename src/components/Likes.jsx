"use client";
import { useSession } from 'next-auth/react';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';

import {useEffect, useState} from 'react'
import { collection, getFirestore, onSnapshot, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../firebase';

export default function Likes({id}) {
    const {data: session} = useSession();
    const [hasLiked, setHasLiked] = useState(false);
    const [likes, setLikes] = useState([]);
    const [likedBy, setLikedBy] = useState([]);
    const db = getFirestore(app);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
            setLikes(snapshot.docs);
            setLikedBy(snapshot.docs.map(doc => doc.data().username));
        });
        return () => unsubscribe();
    }, [db, id]);

    useEffect(() => {
        if (likes.findIndex((like) => like.id === session?.user?.uid) !== -1) {
            setHasLiked(true);
        } else {
            setHasLiked(false);
        }
    }, [likes, session]);

    async function likePost() {
        if (hasLiked){
            await deleteDoc(doc(db, "posts", id, "likes", session?.user?.uid));
        } else {
            await setDoc(doc(db, "posts", id, "likes", session?.user?.uid), {username: session?.user?.username});
        }
    }

  return (
    <div>
      {session && (
        <div className="flex items-center border-t border-gray-100 px-4 pt-4">
          <div className="flex items-center gap-2 ">
            {hasLiked ? (
              <HiHeart
                onClick={likePost}
                className="text-red-500 cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out"
              />
            ) : (
              <HiOutlineHeart onClick={likePost} className="cursor-pointer text-3xl hover:scale-125 transition-transform duration-200 ease-out" />
            )}
            {likes.length > 0 && (
              <p className='text-gray-500'>
                {likes.length} {likes.length === 1 ? 'like' : 'likes'}
              </p>
            )}

            {likedBy.length > 0 && (
                <div className="text-gray-500  ">
                  Liked by {likedBy.join(', ')}
                </div>
              )}
          </div>

        </div>
      )}
    </div>
  );
}
