// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const child_process = require('child_process');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hello" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hello.openfilelist', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showTextDocument(vscode.Uri.file('E:/工作培训/vscode-plugin/test-backup/hello/src/helper.py'));
		if (! vscode.workspace.workspaceFolders) {
			return;
		}
		const workdir: string = vscode.workspace.workspaceFolders[0].uri.path;
		vscode.window.showInformationMessage(`${workdir}`);

		child_process.exec(`python ${__dirname}/helper.py ${workdir}`, (err:any, stdout:string, stderr:string) => {
			if (err) {
				console.log(`err: ${err}`);
				return;
			}
			// console.log(`${stdout}`);
			let obj: any = JSON.parse(stdout);
			if (! obj) {
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
			for (var i=0;i<obj.length;++i) {
				vscode.window.showTextDocument(vscode.Uri.file(obj[i]), options);
				console.log(`open ${obj[i]} !`);
				
			}
    	});

	});

	context.subscriptions.push(disposable);

}

// this method is called when your extension is deactivated
export function deactivate() {}
