import React from 'react';
import { Drawer } from '@mui/material';

const drawerWidth = 240;

interface RightSidePanelProps {
  children?: React.ReactNode;
  onClose?: () => void;
  open: boolean;
}

export function RightSidePanel({ children, onClose, open }: RightSidePanelProps) {
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : 0,
          boxSizing: 'border-box',
        },
      }}
    >
      <div>
        <h2>오른쪽 패널</h2>
        <button onClick={onClose}>닫기</button>
        <div>
          {children}
        </div>
      </div>
    </Drawer>
  );
}
