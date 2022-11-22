const hadleHelperText = (
  error: string | undefined,
  touched: boolean | undefined
) => {
  if (error && touched) {
    return error
  }
  return ''
}

export default hadleHelperText