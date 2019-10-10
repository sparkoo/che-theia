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
import URI from 'vscode-uri';

const cheProjectsRoot = process.env.CHE_PROJECTS_ROOT;
const machineName = process.env.CHE_MACHINE_NAME;

export function overrideVSCodeURI(uri: URI) {
    if (isSubProject(uri.path)) {
        return uri.with({ scheme: `file-sidecar-${machineName}` });
    }
    return uri;
}

export function overrideTheiaURI(uri: theia.Uri) {
    if (isSubProject(uri.path)) {
        return uri.with({ scheme: `file-sidecar-${machineName}` });
    }
    return uri;
}

function isSubProject(path: string) {
    return !machineName && cheProjectsRoot && path.startsWith(cheProjectsRoot);
}
