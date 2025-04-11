import { Link } from "react-router-dom"

export const SuccessPage = () => {
  return (
    <div className="flex px-4 min-h-screen w-full bg-primary-800 font-sans font-semibold text-primary-700 text-2xl">
      <div
        className="mx-auto mt-32 p-6 border-1 bg-background border-primary rounded-3xl h-fit shadow-custom">
        Реєстрація пройшла успішно!
        <br />
        Перейдіть на сторінку
        <div className="hover:border-b-2 border-secondary-600 transition-border duration-100 inline mx-4">
        <Link to="/login" className="text-secondary-600  ">
          Log In
          </Link>
        </div>
      </div>
    </div>
  )
}