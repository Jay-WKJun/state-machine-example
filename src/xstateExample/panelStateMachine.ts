// state machine 설계

// sidepanel은 좌우 하나씩 내용이 들어간다. string이 들어가있으면 open, 무엇이 들어가는지는 string으로 판단된다.
// drawer는 한번에 하나만 나타날 수 있다.

// state: small
// sidePanel 사용 불가능
// drawer는 하나만 가능

// state: medium
// sidePanel 중에 left는 사용 불가, right는 사용 가능
// drawer는 하나만 가능

// state: large
// sidePanel을 할 수 있음.
// drawer는 하나만 가능

// state 변경될 때: sidePanel과 drawer는 모두 닫힘.

import { setup, assign } from 'xstate';

type DrawerDirection = 'left' | 'right';

type PanelEvent =
  | { type: 'SYNC_WIDTH'; width: number }
  | { type: 'OPEN_LEFT_PANEL'; content: string }
  | { type: 'CLOSE_LEFT_PANEL' }
  | { type: 'OPEN_RIGHT_PANEL'; content: string }
  | { type: 'CLOSE_RIGHT_PANEL' }
  | { type: 'OPEN_DRAWER'; content: string; direction?: DrawerDirection }
  | { type: 'CLOSE_DRAWER' };

export const panelMachine = setup({
  types: {
    context: {} as {
      width: number;
      sidePanel: {
        left?: string;
        right?: string;
      };
      drawer?: { content?: string, direction?: DrawerDirection };
    },
    events: {} as PanelEvent
  },
  actions: {
    syncWidth: assign({
      width: ({ context, event }) => {
        if (event.type !== 'SYNC_WIDTH') return context.width;
        return event.width;
      }
    }),
    toggleDrawer: assign({
      drawer: ({ event }) => {
        return {
          content: event.content,
          direction: event.direction ?? 'left',
        }
      }
    }),
    toggleRightDrawer: assign({
      drawer: ({ event }) => {
        return {
          content: event.content,
          direction: 'right',
        };
      }
    }),
    toggleLeftSidePanel: assign({
      sidePanel: ({ context, event }) => {
        if (event.type === 'CLOSE_LEFT_PANEL') {
          return { ...context.sidePanel, left: undefined };
        }
        if (event.type === 'OPEN_LEFT_PANEL') {
          return { ...context.sidePanel, left: event.content };
        }
        return context.sidePanel;
      }
    }),
    toggleRightSidePanel: assign({
      sidePanel: ({ context, event }) => {
        if (event.type === 'CLOSE_RIGHT_PANEL') {
          return { ...context.sidePanel, right: undefined };
        }
        if (event.type === 'OPEN_RIGHT_PANEL') {
          return { ...context.sidePanel, right: event.content };
        }
        return context.sidePanel;
      }
    })
  },
  guards: {
    isSmall: ({ event }) => {
      if (event.type !== 'SYNC_WIDTH') return false;
      return event.width <= 600;
    },
    isMedium: ({ event }) => {
      if (event.type !== 'SYNC_WIDTH') return false;
      return event.width > 600 && event.width <= 960;
    },
    isLarge: ({ event }) => {
      if (event.type !== 'SYNC_WIDTH') return false;
      return event.width > 960;
    }
  }
}).createMachine({
  id: 'panelMachine',
  context: {
    width: 0,
    sidePanel: {
      left: undefined,
      right: undefined
    },
    drawer: undefined
  },
  initial: 'init',
  states: {
    init: {
      on: {
        SYNC_WIDTH: [
          { target: 'small', guard: 'isSmall', actions: 'syncWidth' },
          { target: 'medium', guard: 'isMedium', actions: 'syncWidth' },
          { target: 'large', guard: 'isLarge', actions: 'syncWidth' }
        ]
      }
    },
    small: {
      entry: assign({
        sidePanel: {
          left: undefined,
          right: undefined
        },
        drawer: undefined
      }),
      on: {
        SYNC_WIDTH: [
          { target: 'small', guard: 'isSmall', actions: 'syncWidth' },
          { target: 'medium', guard: 'isMedium', actions: 'syncWidth' },
          { target: 'large', guard: 'isLarge', actions: 'syncWidth' }
        ],
        OPEN_LEFT_PANEL: {
          actions: 'toggleDrawer'
        },
        CLOSE_LEFT_PANEL: {
          actions: 'toggleDrawer'
        },
        OPEN_RIGHT_PANEL: {
          actions: 'toggleRightDrawer'
        },
        CLOSE_RIGHT_PANEL: {
          actions: 'toggleRightDrawer'
        },
        OPEN_DRAWER: {
          actions: 'toggleDrawer'
        },
        CLOSE_DRAWER: {
          actions: 'toggleDrawer'
        }
      },
    },
    medium: {
      entry: assign({
        sidePanel: {
          left: undefined,
          right: undefined
        },
        drawer: undefined
      }),
      on: {
        SYNC_WIDTH: [
          { guard: 'isSmall', target: 'small', actions: 'syncWidth' },
          { guard: 'isMedium', target: 'medium', actions: 'syncWidth' },
          { guard: 'isLarge', target: 'large', actions: 'syncWidth' }
        ],
        OPEN_LEFT_PANEL: {
          actions: 'toggleLeftSidePanel'
        },
        CLOSE_LEFT_PANEL: {
          actions: 'toggleLeftSidePanel'
        },
        OPEN_RIGHT_PANEL: {
          actions: 'toggleRightDrawer'
        },
        CLOSE_RIGHT_PANEL: {
          actions: 'toggleRightDrawer'
        },
        OPEN_DRAWER: {
          actions: 'toggleDrawer'
        },
        CLOSE_DRAWER: {
          actions: 'toggleDrawer'
        }
      },
    },
    large: {
      entry: assign({
        sidePanel: {
          left: undefined,
          right: undefined
        },
        drawer: undefined
      }),
      on: {
        SYNC_WIDTH: [
          { target: 'small', guard: 'isSmall', actions: 'syncWidth' },
          { target: 'medium', guard: 'isMedium', actions: 'syncWidth' },
          { target: 'large', guard: 'isLarge', actions: 'syncWidth' }
        ],
        OPEN_LEFT_PANEL: {
          actions: 'toggleLeftSidePanel'
        },
        CLOSE_LEFT_PANEL: {
          actions: 'toggleLeftSidePanel'
        },
        OPEN_RIGHT_PANEL: {
          actions: 'toggleRightSidePanel'
        },
        CLOSE_RIGHT_PANEL: {
          actions: 'toggleRightSidePanel'
        },
        OPEN_DRAWER: {
          actions: 'toggleDrawer'
        },
        CLOSE_DRAWER: {
          actions: 'toggleDrawer'
        }
      }
    }
  }
});
