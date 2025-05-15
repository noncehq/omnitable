import { useEffect, useLayoutEffect } from 'react';
type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;
declare const createDeepCompareEffect: CreateUpdateEffect;
export default createDeepCompareEffect;
