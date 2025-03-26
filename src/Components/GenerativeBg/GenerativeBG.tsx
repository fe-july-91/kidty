import React, { useCallback, useMemo } from 'react';
import './GenerativeBG.scss';

type Props = {
  isloading?: boolean;
};

const shapes = ['circle', 'square', 'rectangle', 'd-shape', 't-shape'];
const colors = ['#adb0d9', '#9bc7dc', '#cdbdda'];

const GenerativeBG: React.FC<Props> = ({ isloading }) => {
  const rows = 90;
  const columns = 60;

  const generateRandomItem = useCallback((key: number, columnIndex: number) => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return {
      type: `shape ${randomShape}`,
      color: randomColor,
      key,
      columnIndex,
    };
  }, []);

  const grid = useMemo(() => {
    return Array.from({ length: rows * columns }, (_, index) =>
      generateRandomItem(index, index % columns)
    );
  }, []);

  return (
    <div className={`bg-container ${isloading ? 'loading' : ''}`}>
      <div className="bg-grid">
        {grid.map((item) => (
          <div
            key={item.key}
            className={`bg-grid-item ${item.type}`}
            style={{ backgroundColor: item.color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GenerativeBG;
