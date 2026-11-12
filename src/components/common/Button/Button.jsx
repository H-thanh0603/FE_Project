import './Button.css';

/**
 * Component Button chuẩn hóa giao diện.
 * @param {Object} props
 * @param {'dark'|'light'|'outline'|'primary'} [props.variant='dark']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading=false]
 * @param {string} [props.icon] - Tên Material Symbol
 * @param {boolean} [props.iconRight=false]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Button({
  children,
  variant = 'dark',
  size = 'md',
  loading = false,
  icon,
  iconRight = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'app-btn',
    `app-btn--${variant}`,
    size !== 'md' ? `app-btn--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="app-btn-spinner" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && !iconRight && <span className="icon">{icon}</span>}
          <span>{children}</span>
          {icon && iconRight && <span className="icon">{icon}</span>}
        </>
      )}
    </button>
  );
}
