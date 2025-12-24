interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({ message = "Something went wrong" }: ErrorMessageProps) => {
  return <p>{message}</p>;
};