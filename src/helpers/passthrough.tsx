export const PassThrough = ({ config, children }: any) => {
  if (config && process.env.NODE_ENV !== `undefined`) {
    console.log(config)
  }
  return children
}
