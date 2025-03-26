import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root';
import './index.css';

const container = document.getElementById('root') as HTMLElement;

createRoot(container).render(<Root />);
