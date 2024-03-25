/**
 * @param isEnableCheck only gets set to true when user clicks `handleSubmit` function
 * @param errors is either a list of errors returned from other functions, or it's an console.error message indicating an invalid JSON input
 * @returns null
 */
export const handleSetErrors = ({
  isEnableCheck,
  errors,
  setErrors,
  // isErrors,
  setIsNoErrors,
}: {
  isEnableCheck: boolean;
  errors: string[] | [] | undefined | false;
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  // isErrors?: boolean;
  setIsNoErrors?: (value: React.SetStateAction<boolean>) => void;
}) => {
  if (!isEnableCheck) {
    return;
  } else if (isEnableCheck && !errors) {
    return;
  } else {
    if (errors && errors.length == 0) {
      if (setIsNoErrors) {
        setErrors(['🎊 No errors found! 🎊']);
        // isErrors ? setIsNoErrors(true) : setIsNoErrors(false);
      }
    } else if (Array.isArray(errors)) {
      setErrors((prevErrors) => {
        const updatedErrors = [...prevErrors, ...errors];
        const uniqueErrors = [...new Set(updatedErrors)];
        return uniqueErrors;
      });
    }
    return;
  }
};
