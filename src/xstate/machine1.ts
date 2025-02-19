import { setup, assign } from 'xstate';

// 자식 머신
export const childMachine = setup({
  types: {
    context: {} as { childCount: number },
    events: {} as {
      type: 'CHILD_INIT';
    } | {
      type: 'ADD_EVENT';
      number: number;
    } | {
      type: 'DIVIDE_EVENT';
      number: number;
    }
  }
}).createMachine({
  id: 'childMachine',
  initial: 'idle',
  context: {
    childCount: 0,
  },
  states: {
    idle: {
      on: {
        CHILD_INIT: {
          target: 'active'
        }
      }
    },
    active: {
      on: {
        ADD_EVENT: {
          actions: assign(({ context, event }) => {
            console.log('ADD_EVENT', context, event);
            return {
              childCount: context.childCount + event.number
            };
          })
        },
        DIVIDE_EVENT: {
          actions: assign(({ context, event }) => ({
            childCount: context.childCount - event.number
          }))
        }
      }
    }
  },
});

// 부모 머신
export const parentMachine = setup({
  types: {
    context: {} as {
      parentNumber: number;
      childRef: any;
      childSnapshot?: { context: { childCount: number } }
    },
    events: {} as {
      type: 'PARENT_INIT'
    } | {
      type: 'ADD_TO_PARENT';
      number: number;
    } | {
      type: 'ADD_TO_CHILD';
      number: number;
    } | {
      type: 'DIVIDE_FROM_CHILD';
      number: number;
    }
  },
  actions: {
    addToParent: assign({
      parentNumber: ({ context, event }) => {
        console.log('addToParent', context, event);
        if (event.type !== 'ADD_TO_PARENT') return context.parentNumber;
        return context.parentNumber + event.number;
      }
    }),
    syncChildState: assign({
      childSnapshot: ({ context }) => {
        return context.childRef?.getSnapshot();
      }
    })
  }
}).createMachine({
  id: 'parentMachine',
  context: {
    parentNumber: 0,
    childRef: null,
    childSnapshot: undefined
  },
  initial: 'idle',
  states: {
    idle: {
      entry: [
        assign({
          childRef: ({ spawn }) => spawn(childMachine, { id: 'child' })
        }),
        'syncChildState'
      ],
      on: {
        PARENT_INIT: {
          target: 'active',
          actions: [
            ({ context }) => {
              context.childRef.send({ type: 'CHILD_INIT' });
            },
            'syncChildState'
          ]
        }
      }
    },
    active: {
      on: {
        ADD_TO_PARENT: {
          actions: 'addToParent'
        },
        ADD_TO_CHILD: {
          actions: [
            ({ context, event }) => {
              console.log('ADD_TO_CHILD', context, event);
              context.childRef.send({
                type: 'ADD_EVENT',
                number: event.number
              });
            },
            'syncChildState'
          ]
        },
        DIVIDE_FROM_CHILD: {
          actions: [
            ({ context, event }) => {
              context.childRef.send({
                type: 'DIVIDE_EVENT',
                number: event.number
              });
            },
            'syncChildState'
          ]
        }
      }
    }
  }
});
