export default class StickyTableHeader {
    private sizeListener?;
    private scrollListener?;
    private currentFrameRequest?;
    private containerScrollListener?;
    private clickListener?;
    private tableContainerParent;
    private tableContainer;
    private cloneContainer;
    private cloneContainerParent;
    private cloneHeader;
    private scrollParents;
    private header;
    private lastElement;
    private lastElementRefresh;
    private top;
    constructor(tableContainer: HTMLTableElement, cloneContainer: HTMLTableElement, top?: {
        max: number | string;
        [key: number]: number | string;
    });
    private getScrollParents;
    private setup;
    destroy(): void;
    private getScrollParent;
    private getAllScrollParents;
    private setupClickEventMirroring;
    private setupSticky;
    private setupSizeMirroring;
    private setupHorizontalScrollMirroring;
    private createClone;
    private setHorizontalScrollOnClone;
    private sizeToPx;
    private getTop;
    private getBottom;
    private getLastElement;
}
