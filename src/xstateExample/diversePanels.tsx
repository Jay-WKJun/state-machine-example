import React from 'react';
import { Drawer } from '@mui/material';
import { useMachine } from '@xstate/react';
import { panelMachine } from './panelStateMachine';
import { LeftSidePanel } from '../LeftSidePanel';
import { RightSidePanel } from '../RightSidePanel';

export function DiversePanels() {
  const [state, send] = useMachine(panelMachine)

  console.log('state', state.value)

  React.useEffect(() => {
    send({ type: 'SYNC_WIDTH', width: window.innerWidth });
  }, [send]);

  React.useEffect(() => {
    // width 변경 이벤트 리스너
    const handleResize = () => {
      send({ type: 'SYNC_WIDTH', width: window.innerWidth });
    };

    window.addEventListener('resize', handleResize);

    // cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [send]);


  const leftSidePanelContent = state.context.sidePanel.left;
  const rightSidePanelContent = state.context.sidePanel.right;
  const drawerContent = state.context.drawer?.content;
  const drawerDirection = state.context.drawer?.direction;

  const isLeftSidePanelOpen = Boolean(leftSidePanelContent);
  const isRightSidePanelOpen = Boolean(rightSidePanelContent);
  const isDrawerOpen = Boolean(drawerContent);

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '30px' }}>
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', width: '100%', height: '100%' }}>
        <LeftSidePanel
          open={isLeftSidePanelOpen}
          onClose={() => send({ type: 'CLOSE_LEFT_PANEL' })}
        >
          <div style={{ textAlign: 'center' }}>
            <h3>{leftSidePanelContent}</h3>
          </div>
        </LeftSidePanel>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', width: '100%' }}>
            <button onClick={() =>
              isLeftSidePanelOpen
                ? send({ type: 'CLOSE_LEFT_PANEL' })
                : send({ type: 'OPEN_LEFT_PANEL', content: '왼쪽 패널' })
            }>
              왼쪽 패널 {isLeftSidePanelOpen ? '닫기' : '열기'}
            </button>

            <button onClick={() => {
              send({ type: 'OPEN_DRAWER', content: '다른 드로워' })
            }}>
              다른 드로워 열기
            </button>

            <button onClick={() =>
              isRightSidePanelOpen
                ? send({ type: 'CLOSE_RIGHT_PANEL' })
                : send({ type: 'OPEN_RIGHT_PANEL', content: '오른쪽 패널' })
            }>
              오른쪽 패널 {isRightSidePanelOpen ? '닫기' : '열기'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>가운데 패널</h1>
          </div>
        </div>

        <RightSidePanel open={isRightSidePanelOpen} onClose={() => send({ type: 'CLOSE_RIGHT_PANEL' })}>
          <div style={{ textAlign: 'center' }}>
            <h3>{rightSidePanelContent}</h3>
          </div>
        </RightSidePanel>
      </div>

      <Drawer open={isDrawerOpen} anchor={drawerDirection} onClose={() => send({ type: 'CLOSE_DRAWER' })}>
        <div style={{ textAlign: 'center' }}>
          <h3>{drawerContent}</h3>
        </div>
      </Drawer>
    </div>
  );
}
