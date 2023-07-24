const hadleHelperText = (
  error?: string,
  touched?: boolean
) => {
  if ( error && touched ) {
    return error
  }
  return ''
}

export default hadleHelperText