# Obsidian Set Accessed Time - MacOS

When using Obsidian on MacOS, the "date last opened" is not updated. This is useful for tracking notes that haven't been opened in a while and may need to be archived.

This plugin simply touches the file on open, setting the access date on the file. While the atime on the time is set, you will not see "Date Last Opened" updated in the finder. You can run `ls -ltu` on the folder and see that it is updated.

With this plugin in place, you can use DataView to show all of the files that haven't been opened in *n* days.

The example below shows all files last opened more than 7 days ago and excludes the `_templates` and `_archive` folders:

```
Files Opened > 7 days ago
```dataviewjs
const TIME_CRITERIA = '+7';
const ASCENDING = true;
const BASE_PATH = dv.app.vault.adapter.basePath;
const ChildProcess = require("child_process");
const PRUNE = ' ! -path "{P}" '
const EXCLUDES = ['Mentoring', '_templates', '_archive', 'Contacts'];
let excluded = EXCLUDES.map((x) => PRUNE.replace('{P}', `${BASE_PATH}/${x}/*`)).join('');
const COMMAND = `find ${BASE_PATH} -type f -name "*.md" -atime +7 ${excluded} -exec sh -c 'file="{}"; atime=$(stat -f "%a" "$file"); formatted_date=$(date -jf "%s" "$atime" "+%Y-%m-%d %H:%M:%S" 2>/dev/null); [ -n "$formatted_date" ] && echo "[[$file]] $formatted_date"' \\; | sort -k 2 ${ASCENDING ? '-r' : ''}`;
ChildProcess.exec(COMMAND, BASE_PATH, (err, stdout, stderr) => {
	let lines = stdout.toString().split('\n');
	let result = lines.map((line) => {
		if(!line.length) return;
		return `${line.replace(`${BASE_PATH}/`, '')}`;
	})
	result = result.join('\n');
	dv.span(result);
});
```

The code could be cleaned up but it works.

> CAVEAT - The DataView doesn't pick up these changes and auto refresh. You can just keybind the DataView force refresh, though, if it bothers you.

> If there is anything wrong with the command, blame ChatGPT. ;)

## Support the development of the plugin

<a href='https://ko-fi.com/JEBoothjr' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi2.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
