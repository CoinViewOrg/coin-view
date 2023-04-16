import styles from "./LoadingSpinner.module.css";

export const LoadingSpinner = () => {
  return (
    <div data-testid="loading-spinner" className={styles["lds-roller"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
