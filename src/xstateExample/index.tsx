import React from 'react';
import { Drawer } from '@mui/material';
import { useMachine } from '@xstate/react';
import { panelMachine } from './panelStateMachine';
import { LeftSidePanel } from '../LeftSidePanel';
import { RightSidePanel } from '../RightSidePanel';

// content는 하나, 기기 상태에 따라 Drawer인지 SidePanel인지 알아서 결정된다.
const LEFT_PANEL_CONTENT = '왼쪽 패널 콘텐츠';
const RIGHT_PANEL_CONTENT = '오른쪽 패널 콘텐츠';
const DRAWER_CONTENT = '다른 드로워 콘텐츠';

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

        {/* 메세지 보내는 곳 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', width: '100%' }}>
            <button onClick={() =>
              // 한 곳에서 하나의 이벤트만 실행하지만, 상태에 따라 알아서 Drawer, SidePanel 중 하나가 열리게 된다.
              isLeftSidePanelOpen
                ? send({ type: 'CLOSE_LEFT_PANEL' })
                : send({ type: 'OPEN_LEFT_PANEL', content: LEFT_PANEL_CONTENT })
            }>
              왼쪽 패널 {isLeftSidePanelOpen ? '닫기' : '열기'}
            </button>

            <button onClick={() => {
              send({ type: 'OPEN_DRAWER', content: DRAWER_CONTENT })
            }}>
              다른 드로워 열기
            </button>

            <button onClick={() =>
              isRightSidePanelOpen
                ? send({ type: 'CLOSE_RIGHT_PANEL' })
                : send({ type: 'OPEN_RIGHT_PANEL', content: RIGHT_PANEL_CONTENT })
            }>
              오른쪽 패널 {isRightSidePanelOpen ? '닫기' : '열기'}
            </button>
          </div>
          {/* 메세지 보내는 곳 */}

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
