import { client } from "../Utils/httpClient"
import { UserResponseF } from "./users"

export type mailToSupportType = {
  name: string,
  email: string,
  message: string,
}

export const mailToSupport = (data: mailToSupportType): Promise<UserResponseF> => {
  return client.post('/support/send-request-to-email', data)
}