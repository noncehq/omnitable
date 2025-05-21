import type { Omnitable } from '@omnitable/omnitable';
import type { CubeApi } from '@cubejs-client/core';
import type { Query } from '@cubejs-client/core';
declare const _default: (cube: CubeApi) => Omnitable.Adapter;
export default _default;
declare module '@omnitable/omnitable' {
    namespace Omnitable {
        interface Config {
            cube_options?: Partial<Query>;
        }
    }
}
