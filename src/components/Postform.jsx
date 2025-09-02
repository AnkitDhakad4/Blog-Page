import React, { useCallback, useEffect } from 'react'
import {useForm} from 'react-hook-form'
import {Button,Input,Select,RTE} from './index'
import { useDispatch,useSelector } from 'react-redux'
import  service  from '../Appwrite/Database'
import { useNavigate } from 'react-router-dom'
import {login} from '../store/authSlice'


function Postform({post}) {
    
    // console.log('in postform ',post)
    const {register,handleSubmit,watch,setValue,control,getValues,reset}=useForm({
            
        //ye nahi chal rha kyuki jab ye page load hota hai toh ye values set ho jati hai par us time apni post aa nahi pati toh ye empty initalize ho jati hai thats why we using the useeffect jab post me change hoga toh load ho jayega
        // defaultValues:{
            //     title:post?.title || " ",
            //     slug:post?.slug || '',
            //     content:post?.content || '',
            //     status:post?.status || 'active',
            // }
            
    })
            useEffect(() => {
            if (post) {
            reset({
                title: post.title || "",
                slug: post.slug || "",
                content: post.content || "",
                status: post.status || "active",
            });
            }
        }, [post, reset]);
    const navigate=useNavigate();
    // const dispatch=useDispatch()
    // const userData=useSelector(state=>state.auth.userData)
   
    const rawUser = useSelector((state) => state.auth.userData)
    const userData = rawUser?.userData || rawUser


    // console.log('user in postform ',userData)
    const submit=async (data)=>{
        if (userData===undefined) {//Redux state (auth.userData) is populated asynchronously (probably after an API call or Appwrite session check).
                //toh age na jake yahi reh jayega
                return <p>Loading...</p>
            }
        // console.log("in postform to check content ",data)
        
        if(post)
        {
            
            const file=data.image[0]?service.uploadFile(data.image[0],post.slug):null
            // console.log('in postform file is ',file)
            // console.log("in postform Data is ",data)
            // console.log("In post form post is ",post)
            
            if(file)
            {
                // console.log('in postform post is ',post)
                service.deleteFile(post.featuredImage)  
            }
            
            
            // console.log(post)
            const dbpost=await service.updatePost(post.slug,{
                ...data,
                featuredImage:post.featuredImage,
                user:post.user
            })
            // console.log("dbpost ",dbpost)
            if(dbpost)
            {
                navigate(`/post/${dbpost.slug}`)
            }
            else{
                // console.log("dbPost me error hai bhai ")
            }

        }else {
            // console.log("In postform function submit")
            // console.log(data,'\n')
            
            

            const sl=data.slug
            const file=await service.uploadFile(data.image[0],sl)
            if(file)
            {   
                // console.log("User is in if(file) ",userData)
                // console.log(file)
                const fileId=file.$id
                data.featuredImage=fileId
                
                // console.log(userData.userData.$id)
                const dbpost=await service.createPost({
                    ...data,//spread out kiya hai kyuki jab upload hoga toh user id ka access nahi hoga form se
                    user:userData.$id,
                })
                // console.log('In postform in components ',dbpost) 
                if(dbpost)
                {
                    navigate(`/post/${dbpost.$id}`)
                }
            } 
            else{
                // console.log("if ke bahar hai")
            }
        }
    } 

    const slugTransform=useCallback((value)=>{
        // console.log("transfoming the slug")
            if (value && typeof(value)==='string') {
                return value.
                trim()
                .toLowerCase()
                .replace(/\s+/g, '_')        // replace spaces with underscores
                .replace(/[^a-zA-Z0-9_-]/g, ''); // remove all other invalid chars
                return ''
            }
    },[])

    useEffect(()=>{
        const subscription=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug',slugTransform(value.title,//slug ke field ke ander ye milegi
                {shouldValidate:true}))
            }

        })

        return ()=>{
            subscription.unsubscribe()
        }

    },[watch,slugTransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label={post ? "This will not Update" : "Slug"}
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :"
                 name="content"
                 control={control}
                // {...register("content", { required: true })}
                 defaultValue={getValues("content")} />
                 {/* defaultValue={getValues("content")} → loads the editor with whatever content is currently in the form. */}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit"
                 bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}

export default Postform