import { Toaster } from "sonner";

const CustomToaster = () => {
  return (
    <Toaster position="top-center" richColors
      toastOptions={{
        style: {
          fontFamily: 'Outfit',
          borderRadius: 'var(--radius-xs)',
        }
      }} />
  )
}
export default CustomToaster;

