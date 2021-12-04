"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const child_process = require('child_process');
const path = require('path');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "hello" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('hdb.openfilelist', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showTextDocument(vscode.Uri.file('E:/工作培训/vscode-plugin/test-backup/hello/src/helper.py'));
        if (!vscode.workspace.workspaceFolders) {
            return;
        }
        const workdir = vscode.workspace.workspaceFolders[0].uri.path;
        vscode.window.showInformationMessage(`${workdir}`);
        child_process.exec(`python ${__dirname}/openfilelist.py ${workdir}`, (err, stdout, stderr) => {
            if (err) {
                console.log(`err: ${err}`);
                return;
            }
            // console.log(`${stdout}`);
            let obj = JSON.parse(stdout);
            if (!obj) {
                console.log(`parse json error!`);
                return;
            }
            vscode.window.showInformationMessage(`find ${obj.length} files!`);
            const options = {
                // 选中第3行第9列到第3行第17列
                // selection: new vscode.Range(new vscode.Position(2, 8), new vscode.Position(2, 16));
                // 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件
                preview: false,
                // 显示在第二个编辑器
                // viewColumn: vscode.ViewColumn.Two
            };
            for (var i = 0; i < obj.length; ++i) {
                vscode.window.showTextDocument(vscode.Uri.file(obj[i]), options);
                console.log(`open ${obj[i]}`);
            }
        });
    });
    context.subscriptions.push(disposable);
    let disposable2 = vscode.commands.registerCommand('hdb.relaceheadermacro', (uri) => {
        if (!vscode.window.activeTextEditor) {
            return;
        }
        const fileName = vscode.window.activeTextEditor.document.fileName;
        child_process.exec(`python ${__dirname}/relaceheadermacro.py ${fileName}`, (err, stdout, stderr) => {
            if (err) {
                console.log(`err: ${err}`);
                return;
            }
            let obj = JSON.parse(stdout);
            if (!vscode.window.activeTextEditor) {
                return;
            }
            if (obj.occur === 0) {
                vscode.window.showInformationMessage("cant not find patten!");
                return;
            }
            vscode.window.activeTextEditor.edit(editBuilder => {
                if (!vscode.window.activeTextEditor) {
                    return;
                }
                const end = new vscode.Position(vscode.window.activeTextEditor.document.lineCount + 1, 0);
                const text = obj.content;
                editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), text);
            });
            vscode.window.showInformationMessage(`find pattern ${obj.patten} ${obj.occur} times, replace with ${obj.repl}`);
        });
    });
    context.subscriptions.push(disposable2);
    let disposable3 = vscode.commands.registerCommand('hdb.addcommoncode', (uri) => {
        if (!vscode.window.activeTextEditor) {
            return;
        }
        const fileName = vscode.window.activeTextEditor.document.fileName;
        child_process.exec(`python ${__dirname}/addcommoncode.py ${fileName}`, (err, stdout, stderr) => {
            if (err) {
                console.log(`err: ${err}`);
                return;
            }
            vscode.window.showInformationMessage("finished!");
        });
    });
    context.subscriptions.push(disposable3);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map