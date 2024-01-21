import { Plugin, FileSystemAdapter, TFile } from 'obsidian';
const { exec } = require('child_process');

export default class SetAccessedTimePlugin extends Plugin {
  async onload() {
    this.app.workspace.on('file-open', (file: TFile) => {
      let basePath = (this.app.vault.adapter as FileSystemAdapter).getBasePath();
      let filePath = `${basePath}/${file.path}`
      filePath = filePath.replace(/\s+/g, '\\ '); // Escape all spaces in path
      exec(`touch -a ${filePath}`, (err:any, stdout:any, stderr:any) => {
        if (err) {
          console.error('Failed to run "SetAccessedTimePlugin" plugin');
          console.error(err);
          console.error(stderr);
          return;
        }
      });
    });
	}
}
