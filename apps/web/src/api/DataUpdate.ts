import { Data } from '../Shared/types/types';
import { client } from '../Utils/httpClient';

export const getChildData = (typeOfValue: string, childId: number ):Promise<Data[]> => {
  
  return client.get(`children/${childId}/${typeOfValue.toString()}`)
}

export const deleteChildData = (childId: number, typeOfValue: string, dataId: number ) => {
  return client.delete(`children/${childId}/${typeOfValue.toString()}/${dataId}`)
}
