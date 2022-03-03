// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const cp = require('child_process')


function execShell(cmd, on_out) {
	cp.exec(cmd, (err, stdout, stderr) => {
		console.log('[poetry] executing command: ' + cmd)
		console.log('[poetry] stdout: ' + stdout.trim())
		if (err) {
			console.log('[poetry] error: ' + err);
			console.log('[poetry] stderr: ' + stderr);
		}

		on_out(stdout.trim())
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	context.subscriptions.push(vscode.commands.registerCommand('pythonclass.setupPoetry', () => {

		var config = vscode.workspace.getConfiguration("python")

		execShell("poetry config virtualenvs.path", (venv_dir) => {
			// replace homedir with variable
			if ("HOME" in process.env) {
				var home_dir = process.env.HOME
				if (venv_dir.indexOf(home_dir) == 0) {
					venv_dir = venv_dir.replace(home_dir, '${env:HOME}')
				}
			}
			console.log("[poetry] venv_dir: " + venv_dir)
			vscode.window.showInformationMessage(
				'Update venvPath to: ' + venv_dir,
				"OK",
				"Cancel",
			).then(
				answer => {
					if (answer == "OK") {
						config.update("venvPath", venv_dir, false);
					}
				}
			);
		});
	}))

}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
