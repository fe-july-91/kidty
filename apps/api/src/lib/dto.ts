// Shapes returned to the frontend.
import type {
  Child,
  EyeCheck,
  Measurement,
  User,
  Vaccination,
} from '../generated/prisma/client.js';
import { GENDER_LABELS, formatDate, numberToMonth } from './format.js';

export const toUserDto = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const toChildDto = (child: Child & { user: User }) => ({
  id: child.id,
  name: child.name,
  surname: child.surname,
  parent: child.user.name,
  birth: formatDate(child.birthDate),
  genderName: GENDER_LABELS[child.gender],
  image: String(child.avatar),
  userId: child.userId,
  userEmail: child.user.email,
  userName: child.user.name,
});

export const toMeasurementDto = (m: Measurement) => ({
  id: m.id,
  year: String(m.year),
  month: numberToMonth(m.month),
  value: m.value.toNumber(),
});

export const toEyeDto = (childId: number, eye: EyeCheck | null) => ({
  id: eye?.id ?? 0,
  childId,
  leftEye: eye?.leftEye.toNumber() ?? 0,
  rightEye: eye?.rightEye.toNumber() ?? 0,
});

export const toVaccinationDto = (v: Vaccination) => ({
  id: v.id,
  type: v.type,
  date: formatDate(v.date),
});
