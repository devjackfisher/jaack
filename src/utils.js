import { saveAs } from 'file-saver';
import moment from 'moment';
import JSZip from 'jszip';

class Utils {
	static parseOBZ = (zip) =>
		new Promise((resolve, reject) => {
			const boardSet = {
				boards: {},
				manifest: {},
			};

			// Counter to track the number of calls in the async execution stack
			let count = 0;

			zip.forEach((path) => {
				count++;
				zip
					.file(path)
					.async('string')
					.then((data) => {
						if (path.includes('obf')) {
							const board = JSON.parse(data);
							if (board.format !== 'open-board-0.1') {
								reject(new Error('Invalid board format! Boards should be in open-board-0.1 format.'));
							}
							boardSet.boards[path] = board;
						} else if (path.includes('manifest')) {
							const manifest = JSON.parse(data);
							if (manifest.format !== 'open-board-0.1') {
								reject(new Error('Invalid manifest format! The manifest should be in open-board-0.1 format.'));
							}
							boardSet.manifest = manifest;
						}
						// Resolve async promise once final call has executed
						if (!--count) {
							resolve(boardSet);
						}
					});
			});
		});

	static readOBZ = (file) =>
		new Promise((resolve, reject) => {
			JSZip.loadAsync(file, { base64: true })
				.then(this.parseOBZ)
				.then(
					(set) => {
						resolve(set);
					},
					(error) => {
						reject(error);
					}
				);
		});

	static readOBF = (file) =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (event) => {
				const board = JSON.parse(event.target.result);
				if (board.format !== 'open-board-0.1') {
					reject(new Error('Invalid board format! Boards should be in open-board-0.1 format.'));
				}
				resolve(board);
			};

			reader.readAsText(file);
		});

	static exportOBF = (board) => {
		const exportBoard = new Blob([JSON.stringify(board, null, 2)], {
			type: 'application/json',
		});
		const name = board.id ? board.id : 'board';
		const timestamp = moment().format('_YYYY_MM_DD');
		saveAs(exportBoard, name + timestamp + '.obf');
	};

	static exportOBZ = (manifest, boards) => {
		const zip = new JSZip();
		zip.file('manifest.json', JSON.stringify(manifest, null, 2));
		for (const board in boards) {
			zip.file(board, JSON.stringify(boards[board], null, 2));
		}
		zip
			.generateAsync({
				type: 'blob',
				compression: 'DEFLATE',
				platform: 'UNIX',
			})
			.then((file) => {
				const name = boards[manifest.root].id;
				const timestamp = moment().format('_YYYY_MM_DD');
				saveAs(file, name + timestamp + '.obz');
			});
	};
}

export default Utils;
