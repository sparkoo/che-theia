/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import { Resource, ResourceResolver } from '@theia/core/lib/common/resource';
import URI from '@theia/core/lib/common/uri';
import { inject, injectable } from 'inversify';
import { CheSideCarContentReaderRegistry, ContentReaderFunc } from '../common/che-protocol';

export class CheSideCarResource implements Resource {
    constructor(
        public uri: URI,
        protected readonly reader: ContentReaderFunc) { }

    dispose(): void { }

    async readContents(options?: { encoding?: string }): Promise<string> {
        console.log(`>>>>>>>>>>>> READ CONTENT ${this.uri.toString()}`);
        const contents = await this.reader(this.uri.toString(), options);
        if (!contents) {
            console.log(`>>>>>>>>>>>> NO CONTENT ${this.uri.toString()}`);
            throw new Error(`There is no contents for '${this.uri}'`);
        }

        console.log(`>>>>>>>>>>>> READ CONTENT ${contents.length}`);
        return contents;
    }
}

@injectable()
export class CheSideCarContentReaderRegistryImpl implements CheSideCarContentReaderRegistry {
    protected readonly readers = new Map<string, ContentReaderFunc>();

    register(scheme: string, f: ContentReaderFunc): void {
        console.log(`>>>>>>>>>>>> scheme registered ${scheme}`);
        this.readers.set(scheme, f);
    }

    unregister(scheme: string): void {
        this.readers.delete(scheme);
    }

    get(scheme: string): ContentReaderFunc | undefined {
        return this.readers.get(scheme);
    }
}

@injectable()
export class CheSideCarResourceResolver implements ResourceResolver {

    @inject(CheSideCarContentReaderRegistry)
    protected readonly registry: CheSideCarContentReaderRegistry;

    async resolve(uri: URI): Promise<CheSideCarResource> {
        console.log('>>>>>>>>>>> RESOLVE 1');
        if (!uri.scheme.startsWith('file-sidecar')) {
            throw new Error(`The given URI is not a valid side-car resource URI: ${uri}`);
        }

        console.log('>>>>>>>>>>> RESOLVE 2');
        const reader = this.registry.get(uri.scheme);
        if (!reader) {
            throw new Error(`Side car content reader not found for '${uri.scheme}' scheme`);
        }

        console.log('>>>>>>>>>>> RESOLVE 3');
        return new CheSideCarResource(uri, reader);
    }
}
