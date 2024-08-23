import * as vscode from 'vscode';
import { ConfigurationTarget } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vscode-magento-dev-tools" is now active!');

	const addThemePathDisposable = vscode.commands.registerCommand('vscode-magento-dev-tools.addThemePath', async () => {
		await addThemePath();
	});

	context.subscriptions.push(addThemePathDisposable);
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

export function deactivate() {}
