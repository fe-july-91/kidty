import { SignUpForm } from '../Components/SignUpForm';

export const SignUpPage: React.FC = () => {
  return (
    <div className="flex relative justify-center  bg-primary-800">
      <div className="mx-auto pt-10 box-border flex justify-center min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
        <div className="animate-floatUp">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};
