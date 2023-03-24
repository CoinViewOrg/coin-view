import { useRouter } from "next/router";
import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import cx from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/future/image";
import { ThresholdSelect } from "@coin-view/client";
import { Session } from "next-auth";

type PropsType = {
  threshold: number | null;
  session: Session | null;
  onSubmit: (props: {
    username?: string;
    email?: string;
    email_sub: boolean;
  }) => void;
  error?: number;
};

export const ModifyProfileForm = ({
  threshold,
  session,
  onSubmit,
  error,
}: PropsType) => {
  const { t, language } = useCustomTranslation();
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const emailSubRef = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);
  const [emailSubscribed, setEmailSubscribed] = React.useState(false);

  React.useEffect(() => {
    const cryptoalerts = session?.user?.cryptoalerts;
    const newsletters = session?.user?.newsletters;
    const productupdate = session?.user?.productupdate;

    if (cryptoalerts && newsletters && productupdate) {
      setEmailSubscribed(true);
    } else {
      setEmailSubscribed(false);
    }
  }, [
    open,
    session?.user?.cryptoalerts,
    session?.user?.newsletters,
    session?.user?.productupdate,
  ]);

  const handleClick = React.useCallback(() => {
    setOpen((open) => (open = !open));
  }, []);

  const arrowIconMode = React.useMemo(
    () => (open === false ? "down" : "up"),
    [open]
  );

  const handleSubmit = React.useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const username = usernameRef.current?.value.trim();
      const email = emailRef.current?.value.trim();
      const email_sub = emailSubRef.current?.checked || false;

      onSubmit({ username, email, email_sub });
    },
    [onSubmit]
  );

  return (
    <div className={cx(styles.container, styles.profileForm)}>
      <div className={cx(styles.formLabel)} onClick={handleClick}>
        <Image
          src={"/profile.svg"}
          width={32}
          height={32}
          className={cx("svg-adaptive")}
          alt={"profile_set"}
        />
        <p>{t("profile_form_label")}</p>
        <Image
          src={`/arrow_${arrowIconMode}.svg`}
          width={32}
          height={32}
          className={cx("svg-adaptive", styles.rightFormLabelIcon)}
          alt={"arrow"}
        />
      </div>
      {open && (
        <div>
          {session?.user?.email_verified ? (
            <ThresholdSelect
              className={styles.thresholdContainer}
              userThreshold={threshold}
            />
          ) : (
            <p className={styles.specialParagraph}>
              {t("confirm_email_reminder")}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            {!Boolean(session?.user?.google_sso) && (
              <div>
                <div className={styles.formItem}>
                  <label htmlFor="username">
                    {t("register_form_username")}
                  </label>
                  <input
                    id="username"
                    type="username"
                    name="username"
                    pattern="[A-Za-z0-9._\S]{3,30}\w$"
                    maxLength={30}
                    required
                    ref={usernameRef}
                    defaultValue={session?.user?.name || ""}
                  />
                </div>
                <div className={styles.formItem}>
                  <label htmlFor="email">{t("register_form_email")}</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    required
                    ref={emailRef}
                    defaultValue={session?.user?.email || ""}
                  />
                </div>
              </div>
            )}
            <div className={styles.formCheckboxContainer}>
              <input
                id="email_sub"
                type="checkbox"
                name="email_sub"
                ref={emailSubRef}
                onClick={() =>
                  setEmailSubscribed((subscribed) => (subscribed = !subscribed))
                }
                defaultChecked={emailSubscribed ? true : false}
              />
              <label htmlFor="email_sub">
                {t("profile_form_checkbox_label")}
              </label>
            </div>
            <input
              className={styles.formSubmit}
              type="submit"
              value={t("form_save_button")}
            />
            {error && (
              <span className={cx(styles.error, styles.profileFormSpan)}>
                {error == 1 && (
                  <p className={styles.formParagraph}>
                    {t("wrong_credentials")}
                  </p>
                )}
                {error == 2 && (
                  <p className={styles.formParagraph}>
                    {t("user_already_exists")}
                  </p>
                )}
              </span>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
