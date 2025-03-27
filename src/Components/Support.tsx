import { Button, Form, Input, Textarea } from '@heroui/react';
import { mailToSupport } from '../api/support';
import { useState } from 'react';
import { button, support } from '../Utils/Lang';

export const Support = () => {

    const [isSend, setIsSend] = useState(false);
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      const data = Object.fromEntries(new FormData(e.currentTarget));
      console.log(data)
  
      const formData = {
        name: String(data.name),
        email: String(data.email),
        message: String(data.message),
      };
  
      mailToSupport(formData)
        .then(() => setIsSend(true))
    };
  
    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault(); 
      e.currentTarget.reset(); 
    };
  
  return (
    <div className="flex flex-col justify-start w-full">
            <span className=" text-2xl lg:text-4xl text-white font-bold mb-8">
              {support.header.ua}
            </span>

            {isSend ? (
        <div className="text-2xl lg:text-xl text-white p-6 border-small rounded-lg">
          {support.success.ua}
        </div>
            ) : (
              <Form
              className="w-full max-w-2xl flex flex-col space-y-6 font-sans"
              validationBehavior="native"
              onSubmit={(e) => handleSubmit(e)}
              onReset={handleReset}
            >
              <Input
                className="font-sans"
                isRequired
                errorMessage="Please enter your name"
                name="name"
                placeholder={support.name.ua}
              type="text"
              classNames={{ errorMessage: "text-warning-500 min-h-[20px]"}}

              />

              <Input
                isRequired
                errorMessage="Please enter a valid email"
                name="email"
                placeholder={support.email.ua}
                type="email"
                classNames={{ errorMessage: "text-warning-500 min-h-[20px]"}}
              />

              <Textarea 
              name="message" 
              className=" max-w-2xl" 
              placeholder={support.message.ua}
            />

              <div className="flex w-full flex-col md:flex-row gap-2 ">
                <Button
                  className="border-gray-100 text-white"
                  type="reset"
                  color="warning"
                  variant="ghost">
                    {button.reset.ua}
                </Button>
                
                <Button
                  variant="solid"
                  color='primary'
                  type="submit"
                >
                  {button.send.ua}
                </Button>
              </div>
            </Form>
            )}
          </div>
  )
}