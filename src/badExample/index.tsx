import React from 'react';
import { Drawer } from '@mui/material';
import { usePanelStore } from './panelStore';
import { LeftSidePanel } from '../LeftSidePanel';
import { RightSidePanel } from '../RightSidePanel';

const LEFT_PANEL_CONTENT = '왼쪽 패널 콘텐츠';
const RIGHT_PANEL_CONTENT = '오른쪽 패널 콘텐츠';
const DRAWER_CONTENT = '다른 드로워 콘텐츠';

export function BadExample() {
  const {
    width,
    sidePanel,
    drawer,
    setWidth,
    openLeftPanel,
    closeLeftPanel,
    openRightPanel,
    closeRightPanel,
    openDrawer,
    closeDrawer
  } = usePanelStore();

  React.useEffect(() => {
    setWidth(window.innerWidth);
  }, [setWidth]);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWidth]);

  const leftSidePanelContent = sidePanel.left;
  const rightSidePanelContent = sidePanel.right;
  const drawerContent = drawer?.content;
  const drawerDirection = drawer?.direction;

  const isLeftSidePanelOpen = Boolean(leftSidePanelContent);
  const isRightSidePanelOpen = Boolean(rightSidePanelContent);
  const isDrawerOpen = Boolean(drawerContent);

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '30px' }}>
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', width: '100%', height: '100%' }}>
        <LeftSidePanel
          open={isLeftSidePanelOpen}
          onClose={closeLeftPanel}
        >
          <div style={{ textAlign: 'center' }}>
            <h3>{leftSidePanelContent}</h3>
          </div>
        </LeftSidePanel>

        {/* 메세지 보내는 곳 */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', width: '100%' }}>
            <button onClick={() =>
              isLeftSidePanelOpen
                ? closeLeftPanel()
                : openLeftPanel(LEFT_PANEL_CONTENT)
            }>
              왼쪽 패널 {isLeftSidePanelOpen ? '닫기' : '열기'}
            </button>

            <button onClick={() => openDrawer(DRAWER_CONTENT)}>
              다른 드로워 열기
            </button>

            <button onClick={() =>
              isRightSidePanelOpen
                ? closeRightPanel()
                : openRightPanel(RIGHT_PANEL_CONTENT)
            }>
              오른쪽 패널 {isRightSidePanelOpen ? '닫기' : '열기'}
            </button>
          </div>
          {/* 메세지 보내는 곳 */}

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center' }}>가운데 패널</h1>
            <h3 style={{ textAlign: 'center' }}>Zustand 예시</h3>
          </div>
        </div>

        <RightSidePanel open={isRightSidePanelOpen} onClose={closeRightPanel}>
          <div style={{ textAlign: 'center' }}>
            <h3>{rightSidePanelContent}</h3>
          </div>
        </RightSidePanel>

        <Drawer
          anchor={drawerDirection}
          open={isDrawerOpen}
          onClose={closeDrawer}
        >
          <div style={{ padding: '20px', minWidth: '200px' }}>
            <h3>{drawerContent}</h3>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
