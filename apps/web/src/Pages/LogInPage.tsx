import { LogInForm } from '../Components/LogInForm';

export const LogInPage: React.FC = () => {
  return (
    <div className="flex relative bg-primary-800 justify-center min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-128px)]">
      <div className="mx-auto pt-10 box-border flex justify-center min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-128px)]">
        <div className="animate-floatUp">
          <LogInForm />
        </div>
      </div>
    </div>
  );
};
