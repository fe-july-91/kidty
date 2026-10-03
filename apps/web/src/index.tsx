// Tailwind first, so its layer order is declared before any SCSS layers.
import './index.css';
import { createRoot } from 'react-dom/client';
import Root from './Root';

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(<Root />);
