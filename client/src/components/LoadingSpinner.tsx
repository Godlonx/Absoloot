type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-3",
};

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-primary border-t-transparent`}
      />
    </div>
  );
};

export { LoadingSpinner };
