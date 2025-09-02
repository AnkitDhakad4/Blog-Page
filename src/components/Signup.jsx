import {React,useState} from 'react'
import { login as storelogin} from '../store/authSlice'
import {Input,Button,Logo} from './index'
import  authService  from '../Appwrite/Authentication'
import  service  from '../Appwrite/Database'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

function Signup() {
    const navigate=useNavigate();
    const dispatch=useDispatch(); 
    const [error,setError]=useState('');
    const {register,handleSubmit}=useForm()

    const signup=async (data)=>{
        setError("")
        //  console.log("In signup in components data is    ",data)    
        const user= await authService.createAccount(data)
       
        // console.log("In signup in components ",user)    
        try {
            if(user){
                
                const userData=await authService.getcurrentUser()
                if(userData)
                {
                    dispatch(storelogin(userData))  
                }
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
            // console.log('Error is Signup in Components folder ',error)
        }
    }
  return (
    <div className="flex items-center justify-center text-black">
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
            <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
            </div>
            <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
            <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
            <form
            onSubmit={handleSubmit(signup)}//ye signupme data pane aap nahi milega register ke through milega
            className='space-y-5'
            >
                <Input
                label='name'
                placeholder='Enter your name'
                {...register('name',{
                    required:true
                })}
                />

                <Input
                label='email'
                type='email'
                placeholder='Enter your Email'
                {...register('email',{
                    required:true,
                    validate:(value)=>{
                        matchPatern:(value)=> /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.
                        test(value)||
                        "Email address must be validate address"
                    }
                })}
                />

                <Input
                label='password'
                type='password'
                {...register('password',{
                    required:true
                })}
                />
                <Button 
                className='w-full'
                type='submit'>Create Account</Button>
                </form>                    
        </div>

    </div>
  )
}

export default Signup