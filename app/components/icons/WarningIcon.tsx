/**
 * Warning icon component
 * @param {Object} props - Component props
 * @param {string} props.className - Optional CSS class name
 * @returns {JSX.Element} SVG icon
 */
const WarningIcon = ({ className = 'h-5 w-5 text-amber-500' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 7.5v1.67m0 3.33h.01m-5.782 3.334h11.554c1.283 0 2.085-1.39 1.443-2.5l-5.777-10c-.642-1.11-2.244-1.11-2.886 0l-5.777 10c-.642 1.11.16 2.5 1.443 2.5z"
    />
  </svg>
);

export default WarningIcon;
