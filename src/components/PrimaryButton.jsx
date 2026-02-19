export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        bg-lime-400 hover:bg-lime-500
        transition-all duration-300
        text-black font-medium
        px-6 py-3
        rounded-full
        shadow-md hover:shadow-lg
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-lime-300
        ${className}
      `}
    >
      {children}
    </button>
  );
}
