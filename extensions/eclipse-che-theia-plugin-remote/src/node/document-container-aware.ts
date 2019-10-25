/*********************************************************************
 * Copyright (c) 2019 Red Hat, Inc.
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 **********************************************************************/

import * as theia from '@theia/plugin';
import { DocumentsExtImpl } from '@theia/plugin-ext/lib/plugin/documents';
import URI from 'vscode-uri';
import { overrideUri } from './che-content-aware-utils';

export class DocumentContainerAware {

    static makeDocumentContainerAware(documentExt: DocumentsExtImpl) {
        const documentContainerAware = new DocumentContainerAware();
        documentContainerAware.overrideGetDocumentData(documentExt);
        documentContainerAware.overrideOpenDocument(documentExt);
        documentContainerAware.overrideShowDocument(documentExt);
    }

    overrideOpenDocument(documentExt: DocumentsExtImpl) {
        const originalOpenDocument = documentExt.openDocument.bind(documentExt);
        const openDocument = (uri: URI) => {
            const newUri = overrideUri(uri);
            console.log(newUri);
            return originalOpenDocument(newUri);
        };
        documentExt.openDocument = openDocument;
    }

    overrideShowDocument(documentExt: DocumentsExtImpl) {
        const originalShowDocument = documentExt.showDocument.bind(documentExt);
        const showDocument = (uri: URI, options?: theia.TextDocumentShowOptions) => {
            const newUri = overrideUri(uri);
            console.log(newUri);
            return originalShowDocument(newUri, options);
        };
        documentExt.showDocument = showDocument;
    }

    overrideGetDocumentData(documentExt: DocumentsExtImpl) {
        const originalGetDocumentData = documentExt.getDocumentData.bind(documentExt);
        const getDocumentData = (resource: theia.Uri) => {
            const newUri = overrideUri(resource);
            console.log(newUri);
            return originalGetDocumentData(newUri);
        };
        documentExt.getDocumentData = getDocumentData;
    }
}
