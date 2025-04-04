export type Data = {
  id: number;
  year: string;
  month: string;
  value: number;
};

export type EyeResponce = {
  id: number;
  childId: number;
  leftEye: number;
  rightEye: number;
};

export interface YearlyMeasurementData {
  type: 'weight' | 'height' | 'foot';
  data: Data[];
}

export type Eye = {
  leftEye: number;
  rightEye: number;
};

export interface EyesData {
  type: string;
  data: Eye;
}

export type VaccineData = {
  id: number;
  type: string;
  date: string;
};

export type VaccinesData = {
  type: string;
  data: VaccineData[];
};
export type ChildData = (YearlyMeasurementData | EyesData | VaccinesData)[];

export type Child = {
  id: number;
  name: string;
  surname: string;
  parent: string;
  birth: string;
  genderName: string;
  image: string;
  userId: number;
  userEmail: string;
  userName: string;
};

export enum CardTitleTypes {
  height = 'Зріст',
  weight = 'Вага',
  foot = 'Стопа',
  eyes = 'Зір',
  vactination = 'Щеплення',
}

export type PersonalData = {
  id: number;
  name: string;
  email: string;
};
