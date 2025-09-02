import React from 'react'
import { useEffect,useState } from 'react'
import { Container,Postform } from '../components'
import service from '../Appwrite/Database'
import { useParams,useNavigate } from 'react-router-dom'

function EditPost() {
    const [post,setPost]=useState([])
    const {slug}=useParams()//useParams is a hook that lets you access the dynamic parameters from the current URL.
    const navigate=useNavigate()
    //   console.log("In edit post featuredImage is ",featuredImage)
    useEffect(()=>{
        service.getPost(slug).then((post)=>{
            if(post)
            {
                setPost(post);
                // console.log("In edit post ",post)
            }else{
                navigate('/')
            }
        })
    },[slug,navigate])
  return post ? (
  <div className='py-8'>
        <Container>
            {/* {console.log("in editpost container",post)} */}
            <Postform post={post}/>
        </Container>
  </div>):null
}

export default EditPost