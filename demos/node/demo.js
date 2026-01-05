/*
 * NAME: demo.js
 * AUTH: Brent Ely (https://github.com/gitbrent/)
 * DATE: 20210502
 * DESC: PptxGenJS feature demos for Node.js
 * REQS: npm 4.x + `npm install pptxgenjs`
 *
 * USAGE: `node demo.js`       (runs local tests with callbacks etc)
 * USAGE: `node demo.js All`   (runs all pre-defined tests in `../common/demos.js`)
 * USAGE: `node demo.js Text`  (runs pre-defined single test in `../common/demos.js`)
 */

import { execGenSlidesFuncs, runEveryTest } from "../modules/demos.mjs";
import pptxgen from "hcpptxgenjs";

// ============================================================================

const exportName = "PptxGenJS_Demo_Node";
let pptx = new pptxgen();

console.log(`\n\n--------------------==~==~==~==[ STARTING DEMO... ]==~==~==~==--------------------\n`);
console.log(`* pptxgenjs ver: ${pptx.version}`);
console.log(`* save location: ${process.cwd()}`);

function pxToPt(px, dpi = 96) {
	// 1pt = 1/72 inch, 1px = 1/dpi inch
	// 因此 1px = (72 / dpi) pt
	return px * (72 / dpi);
}

function pixelsToDXA(pixels, dpi = 96) {
	// 1英寸 = 72磅 = 1440 DXA (因 1磅=20 DXA)
	const dxaPerInch = 1440; // 72磅/英寸 * 20 DXA/磅
	return Math.round((pixels * dxaPerInch) / dpi);
}

// 进阶用法：如需转换为EMU
function dxaToEMU(dxa) {
	return dxa * 635; // 1 DXA = 635 EMU
}

function pixelsToEMU(pixels) {
	// 1英寸 = 914400 EMU，假设屏幕DPI为96像素/英寸
	const emuPerInch = 914400;
	const pixelsPerInch = 96;
	// 计算每个像素对应的EMU值，并四舍五入取整
	return Math.round((pixels * emuPerInch) / pixelsPerInch);
}

if (process.argv.length > 2) {
	// A: Run predefined test from `../common/demos.js` //-OR-// Local Tests (callbacks, etc.)
	Promise.resolve()
		.then(() => {
			if (process.argv[2].toLowerCase() === "all") return runEveryTest(pptxgen);
			return execGenSlidesFuncs(process.argv[2], pptxgen);
		})
		.catch((err) => {
			throw new Error(err);
		})
		.then((fileName) => {
			console.log(`EX1 exported: ${fileName}`);
		})
		.catch((err) => {
			console.log(`ERROR: ${err}`);
		});
} else {
	// B: Omit an arg to run only these below
	let slide = pptx.addSlide();
	slide.addText(
		[
			{
				text: "你好var a=1",
				options: {
					mathBlock: false,
					color: "#02216c",
					objectName: "Text 0",
					line: {},
					lineSpacing: null,
					lineSpacingMultiple: 0.9199999999999999,
					_lineIdx: 0,
					align: "center",
					paraSpaceBefore: 3.75,
					x: 2.205486754551161,
					y: 1.9247387940376206,
					w: 5.5,
					h: 0.92,
					fontSize: 50,
					fontFace: "Source Han Sans CN Regular",
					fontFaceEn: "JetBrains Mono",
					valign: "top",
					margin: 7.5,
					wrap: true,
					fit: "resize",
					bold: true,
				},
			},
		],
		{
			x: 2.205486754551161,
			y: 1.9247387940376206,
			w: 5.5,
			h: 0.92,
			fontSize: 50,
			fontFace: "Source Han Sans CN Regular",
			fontFaceEn: "JetBrains Mono",
			color: "#02216c",
			valign: "top",
			margin: 7.5,
			paraSpaceBefore: 3.75,
			lineSpacingMultiple: 0.9199999999999999,
			wrap: true,
			fit: "resize",
			bold: true,
			align: "center",
			objectName: "Text 0",
			line: {},
			lineSpacing: null,
		}
	);

	// slide.addShape(pptx.shapes.OVAL, {
	// 	x: 2,
	// 	y: 2,
	// 	w: 3,
	// 	h: 2,
	// 	fill: "00FF00",
	// 	line: "000000",
	// 	lineSize: 1,
	// 	gradient: {
	// 		type: "circle",
	// 		rotate: 90,
	// 		colors: [
	// 			{
	// 				pos: 0,
	// 				color: "#d55b5b",
	// 				alpha: 0,
	// 			},
	// 			{
	// 				pos: 40,
	// 				color: "#cdd55b",
	// 				alpha: 0,
	// 			},
	// 			{
	// 				pos: 72,
	// 				color: "#5bb9d5",
	// 				alpha: 51,
	// 			},
	// 			{
	// 				pos: 100,
	// 				color: "#ffffff",
	// 				alpha: 0,
	// 			},
	// 		],
	// 	},
	// });
	// slide.addShape(pptx.shapes.OVAL_CALLOUT, { x: 6, y: 2, w: 3, h: 2, fill: "00FF00", line: "000000", lineSize: 1 }); // Test shapes availablity

	// EXAMPLE 1: Saves output file to the local directory where this process is running
	pptx.writeFile({ fileName: exportName })
		.catch((err) => {
			throw new Error(err);
		})
		.then((fileName) => {
			console.log(`EX1 exported: ${fileName}`);
		})
		.catch((err) => {
			console.log(`ERROR: ${err}`);
		});

	// EXAMPLE 2: Save in various formats - JSZip offers: ['arraybuffer', 'base64', 'binarystring', 'blob', 'nodebuffer', 'uint8array']
	// pptx.write("base64")
	// 	.catch((err) => {
	// 		throw new Error(err);
	// 	})
	// 	.then((data) => {
	// 		console.log(`BASE64 TEST: First 100 chars of 'data':\n`);
	// 		console.log(data.substring(0, 99));
	// 	})
	// 	.catch((err) => {
	// 		console.log(`ERROR: ${err}`);
	// 	});

	// **NOTE** If you continue to use the `pptx` variable, new Slides will be added to the existing set
}

// ============================================================================

console.log(`\n--------------------==~==~==~==[ ...DEMO COMPLETE ]==~==~==~==--------------------\n\n`);
