import React from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Likes from './Likes';
import CommentSection from './CommentSection';

export default function Post({post}) {
  return (
    <div className="bg-white my-7 border rounded-md">
      <div className="flex items-center p-5 border-b border-gray-300 ">
        <img
          src={post.profileImg}
          alt={post.username}
          className="rounded-full h-12 w-12 object-cover border p-1 mr-3"
        />
        <p className="flex-1 font-bold">{post.username}</p>
        <HiOutlineDotsVertical className="cursor-pointer h-5" />
      </div>
      <img
        src={post.image}
        alt={post.username}
        className="w-full object-cover"
      />

      <Likes id={post.id} />

      <p className="p-5 truncate">
        <span className="font-bold mr-2">{post.username}</span>
        {post.caption}
      </p>
      <CommentSection id={post.id} />
    </div>
  );
}
