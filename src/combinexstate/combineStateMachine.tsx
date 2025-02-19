import React from 'react';
import { parentMachine } from './machine1';
import { useMachine } from '@xstate/react'

export function CombineStateMachine() {
  const [state, send] = useMachine(parentMachine);

  console.log('state',state)

  return (
    <div>
      <div>
        <h1>부모 머신</h1>
        <p>부모 머신의 상태: {state.value}</p>
        <p>부모 머신의 숫자: {state.context.parentNumber}</p>
      </div>
      {state.context.childRef && (
        <div>
          <h1>자식 머신</h1>
          <p>자식 머신의 숫자: {state.context.childSnapshot?.context.childCount}</p>
        </div>
      )}
      <div>
        <button onClick={() => send({ type: 'PARENT_INIT' })}>부모 초기화</button>
        <button onClick={() => send({ type: 'ADD_TO_PARENT', number: 1 })}>부모에게 더하기</button>
        <button onClick={() => send({ type: 'ADD_TO_CHILD', number: 1 })}>자식에게 더하기</button>
        <button onClick={() => send({ type: 'DIVIDE_FROM_CHILD', number: 1 })}>자식에게 빼기</button>
      </div>
    </div>
  );
}

