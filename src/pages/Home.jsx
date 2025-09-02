import React from 'react'
import { useEffect,useState } from 'react'
import { Container,PostCard } from '../components'
import  service  from '../Appwrite/Database' 

function Home() {
    const [posts,setPosts]=useState([])
    // console.log("posts printing from home", posts.documents)
    useEffect(()=>{
        service.getPosts().then((posts)=>{
            if(posts)
            {
                setPosts(posts)
            }
        })
    },[])

    if(posts.length===0)
    {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-gray-500'>
                            Login to read Posts
                            </h1>

                        </div>

                    </div>
                </Container>

            </div>
        )
    }else{
        return(
            <div className='w-full py-8'>
                <Container>
                    <div className='flex flex-wrap'>
                        {posts.documents.map((post)=>(
                            <div className='p-2 w-1/4 ' key={post.$id}>
                                {<PostCard post={post}/>}
                                </div>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
}

export default Home