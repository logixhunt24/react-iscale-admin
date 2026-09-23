import React from 'react';
import { Link } from 'react-router-dom';

export default function ThemeButton({
  children,
  onClick,
  to,
  state,
  replace,
  type = 'button',
  variant = 'solid-green', // 'solid-green' | 'outline-green' | 'white-add' | 'pill-green'
  className = '',
  icon = null,
  disabled = false,
  ...props
}) {
  const baseStyles = "transition-all duration-300 font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    'solid-green': "!bg-[#144f36] hover:!bg-[#0f3d2a] !text-white px-5 py-2 rounded-lg text-sm transition-colors",
    'outline-green': "!border-2 !border-[#144f36] !text-[#144f36] !bg-white hover:!bg-[#144f36] hover:!text-white px-5 py-2 rounded-lg text-sm transition-colors",
    'white-add': "!bg-white hover:!bg-slate-50 !text-[#144f36] px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow",
    'pill-green': "!bg-[#144f36] hover:!bg-[#0f3d2a] !text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";
  const classes = `${baseStyles} ${variants[variant] || variants['solid-green']} ${disabledStyles} ${className}`;

  // A real link (not a button) when `to` is given, so it can be opened in a new tab.
  if (to) {
    return (
      <Link to={to} state={state} replace={replace} onClick={onClick} aria-disabled={disabled || undefined} className={classes} {...props}>
        {icon && <span>{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
