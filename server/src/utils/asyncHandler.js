const asyncHandler = (func) => async(req, res, next) => {
    try {
        await func(req, res, next)
        
    } catch (error) {
        res.status( 500).json({
            success:false,
            message:error.message
        })  
        
    }
}

export default asyncHandler




// const myfunc = (func)=> (arg2, arg3, arg4)=>{
//     func(arg2,arg3,arg4)
//     console.log("hello", arg2, arg3, arg4,)
//   }
  
//   const insideFunc = (p1, p2, p3)=>{
//     console.log(p1,p2,p3, "hello i am inside func")
  
//   }
  
//   const mynewfunc = myfunc(insideFunc)
//   mynewfunc(2,3,4)


