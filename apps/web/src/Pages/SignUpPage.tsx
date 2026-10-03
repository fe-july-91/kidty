import { SignUpForm } from '../Components/SignUpForm';

export const SignUpPage: React.FC = () => {
  return (
    <div className="flex relative justify-center  bg-primary-800">
      <div className="absolute flex items-center justify-center px-4 py-1 rounded-lg bg-secondary text-white text-lg">
        Sorry, application currently is under reconstruction, you can't go to
        the main dashboard.
      </div>
      <div className="mx-auto pt-10 box-border flex justify-center min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
        <div className="animate-floatUp">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};
