import { LogInForm } from '../Components/LogInForm';

export const LogInPage: React.FC = () => {
  return (
    <div className="flex relative bg-primary-800 justify-center min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-128px)]">
      <div className="absolute flex items-center justify-center px-4 py-1 rounded-lg bg-secondary text-white text-lg">
        Sorry, application currently is under reconstruction, you can't go to
        the main dashboard.
      </div>
      <div className="mx-auto pt-10 box-border flex justify-center min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
        <div className="animate-floatUp">
          <LogInForm />
        </div>
      </div>
    </div>
  );
};
