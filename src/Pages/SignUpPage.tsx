import { SignUpForm } from '../Components/SignUpForm/SignUpForm';

export const SignUpPage: React.FC = () => {
  return (
    <div>
      <div className="mx-auto pt-10 box-border flex justify-center h-full">
        <div className="animate-floatUp">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};
