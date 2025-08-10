"use client";

type Props = {
  label: string;
  message: string;
  className?: string;
  disabled?: boolean;
};

export default function WhatsAppCTA({
  label,
  message,
  className,
  disabled,
}: Props) {
  const number = (process.env as any).NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const classes = ["btn", "ring-[color:var(--success)]/30", className]
    .filter(Boolean)
    .join(" ");
  return (
    <a
      className={classes}
      href={disabled ? undefined : href}
      target="_blank"
      rel="noreferrer"
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) e.preventDefault();
      }}
    >
      {label}
    </a>
  );
}
