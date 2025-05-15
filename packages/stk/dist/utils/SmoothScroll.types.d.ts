export type ArgsSmoothScroll = Partial<{
    animationTime: number;
    stepSize: number;
    accelerationDelta: number;
    accelerationMax: number;
    keyboardSupport: boolean;
    arrowScroll: number;
    pulseAlgorithm: boolean;
    pulseScale: number;
    pulseNormalize: number;
    touchpadSupport: boolean;
    fixedBackground: boolean;
    excluded: string;
}>;
