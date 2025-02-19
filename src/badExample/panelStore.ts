import { create } from 'zustand';

type DrawerDirection = 'left' | 'right';

interface PanelState {
  state: 'small' | 'medium' | 'large';
  width: number;
  sidePanel: {
    left?: string;
    right?: string;
  };
  drawer?: {
    content?: string;
    direction?: DrawerDirection;
  };
  setWidth: (width: number) => void;
  openLeftPanel: (content: string) => void;
  closeLeftPanel: () => void;
  openRightPanel: (content: string) => void;
  closeRightPanel: () => void;
  openDrawer: (content: string, direction?: DrawerDirection) => void;
  closeDrawer: () => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  state: 'small',
  width: 0,
  sidePanel: {
    left: undefined,
    right: undefined,
  },
  drawer: undefined,

  setWidth: (width) => {
    // entry 로직과 비교해보자...
    if (width > 960) {
      set((prev) => {
        if (prev.state === 'large') return prev;

        return {
          state: 'large',
          sidePanel: {
            left: undefined,
            right: undefined
          },
          drawer: undefined
        };
      });
    }
    if (width > 600 && width <= 960) {
      set((prev) => {
        if (prev.state === 'medium') return prev;

        return {
          state: 'medium',
          sidePanel: {
            left: undefined,
            right: undefined
          },
          drawer: undefined
        };
      });
    }
    if (width <= 600) {
      set((prev) => {
        if (prev.state === 'small') return prev;

        return {
          state: 'small',
          sidePanel: {
            left: undefined,
            right: undefined
          },
          drawer: undefined
        };
      });
    }
  },

  openLeftPanel: (content) =>
    set((prev) => {
      // 로직이 3개뿐이고 단순해서 이정도이지만 state가 더 늘어난다면?
      if (prev.state === 'small') {
        return {
          drawer: {
            content,
            direction: 'left'
          }
        }
      };

      return {
        sidePanel: { ...prev.sidePanel, left: content }
      };
    }
  ),

  closeLeftPanel: () =>
    set((prev) => {
      // 로직이 3개뿐이고 단순해서 이정도이지만 state가 더 늘어난다면?
      if (prev.state === 'small') {
        return {
          drawer: undefined
        }
      }

      return { sidePanel: { ...prev.sidePanel, left: undefined } }
    }),

  openRightPanel: (content) =>
    set((prev) => {
      // 로직이 3개뿐이고 단순해서 이정도이지만 state가 더 늘어난다면?
      if (prev.state === 'large') {
        return {
          sidePanel: {
            ...prev.sidePanel,
            right: content
          }
        }
      }

      return {
        drawer: {
          content,
          direction: 'right'
        }
      }
    }),

  closeRightPanel: () =>
    set((prev) => {
      // 로직이 3개뿐이고 단순해서 이정도이지만 state가 더 늘어난다면?
      if (prev.state === 'large') {
        return {
          sidePanel: { ...prev.sidePanel, right: undefined }
        }
      }

      return {
        drawer: undefined
      }
    }),

  openDrawer: (content, direction = 'left') =>
    set({
      drawer: { content, direction }
    }),

  closeDrawer: () =>
    set({
      drawer: undefined
    }),
}));
