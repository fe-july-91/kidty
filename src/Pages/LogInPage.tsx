import { LogInForm } from '../Components/LogInForm/LogInForm';

export const LogInPage: React.FC = () => {
  return (
    <div>
      <div className="mx-auto pt-10 box-border flex justify-center h-full">
        <div className="animate-floatUp">
          <LogInForm />
        </div>
      </div>
    </div>
  );
};
