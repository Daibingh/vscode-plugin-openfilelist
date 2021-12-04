"use strict";
/* IMPORT */
Object.defineProperty(exports, "__esModule", { value: true });
// import * as _ from 'lodash';
// import * as absolute from 'absolute';
const fs = require("fs");
const path = require("path");
// import * as pify from 'pify';
const vscode = require("vscode");
// import * as Commands from './commands';
/* UTILS */
const Utils = {
    initCommands(context) {
        const { commands } = vscode.extensions.getExtension('fabiospampinato.vscode-open-multiple-files').packageJSON.contributes;
        commands.forEach(({ command, title }) => {
            const commandName = _.last(command.split('.')), handler = Commands[commandName], disposable = vscode.commands.registerCommand(command, handler);
            context.subscriptions.push(disposable);
        });
        return Commands;
    },
    file: {
        open(filePath, isTextDocument = true) {
            filePath = path.normalize(filePath);
            const fileuri = vscode.Uri.file(filePath);
            if (isTextDocument) {
                return vscode.workspace.openTextDocument(fileuri)
                    .then(doc => vscode.window.showTextDocument(doc, { preview: false }));
            }
            else {
                return vscode.commands.executeCommand('vscode.open', fileuri);
            }
        }
    },
    folder: {
        async is(folderpath) {
            const stats = await pify(fs.lstat)(folderpath);
            return stats.isDirectory();
        },
        getRootPath(basePath) {
            const { workspaceFolders } = vscode.workspace;
            if (!workspaceFolders)
                return;
            const firstRootPath = workspaceFolders[0].uri.fsPath;
            if (!basePath || !absolute(basePath))
                return firstRootPath;
            const rootPaths = workspaceFolders.map(folder => folder.uri.fsPath), sortedRootPaths = _.sortBy(rootPaths, [path => path.length]).reverse(); // In order to get the closest root
            return sortedRootPaths.find((rootPath) => basePath.startsWith(rootPath));
        },
    }
};
/* EXPORT */
exports.default = Utils;
//# sourceMappingURL=utils.js.map