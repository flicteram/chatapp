
import { FormikHelpers } from 'formik'

export default function handleFieldError<T>( loginError:string, formik: FormikHelpers<T>, errorsKeys:string[]){
  errorsKeys.forEach( errorKey=>{
    if ( loginError.toLowerCase().includes( errorKey ) ) {
      formik.setFieldError( errorKey, loginError )
    }
  })
}