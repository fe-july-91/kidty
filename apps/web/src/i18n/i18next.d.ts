import 'i18next';
import uk from './locales/uk';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof uk };
  }
}
