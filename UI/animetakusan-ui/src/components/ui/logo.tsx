import { cn } from "@/lib/utils";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo = ({ size = 'md', className = '', showText = true }: LogoProps) => {
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-20 w-20'
  };

  const textSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src="/images/logo.png"
        alt="Anime Takusan"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className={`font-semibold text-white ${textSizeClasses[size]}`}>
          Anime Takusan
        </span>
      )}
    </div>
  );
};
export default Logo;