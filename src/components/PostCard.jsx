import React from 'react'
import service from '../Appwrite/Database'
import { Link } from 'react-router-dom'
function PostCard({post}) {//Since you’re using Appwrite, each document (or file) returned from the Appwrite database comes with some system fields like: like $id $databaseid toh $ lagaya
  const {slug,title}=post
  console.log(post)
  
  return (
    <Link  to={`/post/${slug}`}>
        <div
        className='w-full bg-gray-100 rounded-xl p-4'
        > 
        <div className='w-full  mb-4'>
            <img src={service.getFilePreview(slug)} alt={title}  className='rounded-xl'/>
        </div>
        <br />
        <h2 className='font-bold text-red-800'>{title}</h2>

    </div>
    </Link>
  )
}

export default PostCard