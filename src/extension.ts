import * as vscode from 'vscode';
import { ConfigurationTarget } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-magento-dev-tools" is now active!');

	const addThemePathDisposable = vscode.commands.registerCommand('vscode-magento-dev-tools.addThemePath', async () => {
		await addThemePath();
	});

	const copyToThemeDisposable = vscode.commands.registerCommand('vscode-magento-dev-tools.copyToTheme', async (fileUri: vscode.Uri) => {
		await copyToTheme(fileUri);
	});

	context.subscriptions.push(addThemePathDisposable);
	context.subscriptions.push(copyToThemeDisposable);
}

async function addThemePath() {
	const newThemePath = await vscode.window.showInputBox({
		prompt: 'Enter the path to the new Magento 2 theme directory'
	});

	if (newThemePath) {
		const config = vscode.workspace.getConfiguration();
		const themePaths = config.get<string[]>('magentoDevTools.themePaths') || [];
		themePaths.push(newThemePath);
		await config.update('magentoDevTools.themePaths', themePaths, ConfigurationTarget.Global);
		vscode.window.showInformationMessage(`Theme path added: ${newThemePath}`);
	}
}

async function copyToTheme(fileUri: vscode.Uri) {
	const config = vscode.workspace.getConfiguration();
	const themePaths = config.get<string[]>('magentoDevTools.themePaths') || [];

	if (themePaths.length === 0) {
		vscode.window.showWarningMessage('No theme paths configured. Please add a theme path first.');
		return;
	}

	const selectedTheme = await vscode.window.showQuickPick(themePaths, {
		placeHolder: 'Select a theme to copy the file to'
	});

	if (selectedTheme) {
		const destinationPath = path.join(selectedTheme, path.basename(fileUri.fsPath));
		fs.copyFile(fileUri.fsPath, destinationPath, (err) => {
			if (err) {
				vscode.window.showErrorMessage(`Failed to copy file: ${err.message}`);
			} else {
				vscode.window.showInformationMessage(`File copied to theme: ${destinationPath}`);
			}
		});
	}
}

export function deactivate() {}
