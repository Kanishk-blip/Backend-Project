class apierror extends error{
constructor(
    statusCode,
    error=[],
    message="there is some error",
    stack,
){
    super(message)
    this.statusCode=statusCode,
    this.message=message,
    this.error=error,
    this.data=null,
    this.success=false
    if(stack){
        this.stack=stack
    }else{
        Error.captureStackTrace(this, this.constructor)
    }
}
}
export{apierror}