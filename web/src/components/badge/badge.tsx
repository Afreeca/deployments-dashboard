import styles from "./badge.module.scss";

type BadgeVariant =
  | "active"
  | "failed"
  | "stopped"
  | "production"
  | "staging"
  | "development";

type BadgeProps = {
  children: React.ReactNode;
  variant: BadgeVariant;
};

export function Badge({ children, variant }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
}
